package api

import (
	"database/sql"
	"net/http"
	"time"

	db "github.com/rishabhkanojiya/orbitdeck/server/auth/db/sqlc"
	"github.com/rishabhkanojiya/orbitdeck/server/auth/token"
	"github.com/rishabhkanojiya/orbitdeck/server/auth/util"
	"github.com/rishabhkanojiya/orbitdeck/server/auth/worker"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/hibiken/asynq"
	"github.com/lib/pq"
)

type createUserRequest struct {
	Username string `json:"username" binding:"required,alphanum"`
	Password string `json:"password" binding:"required,min=6"`
	FullName string `json:"full_name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
}

type userResponse struct {
	Username          string    `json:"username"`
	FullName          string    `json:"full_name"`
	Email             string    `json:"email"`
	PasswordChangedAt time.Time `json:"password_changed_at"`
	CreatedAt         time.Time `json:"created_at"`
}

func newUserResponse(user db.User) userResponse {
	return userResponse{
		Username:          user.Username,
		FullName:          user.FullName,
		Email:             user.Email,
		PasswordChangedAt: user.PasswordChangedAt,
		CreatedAt:         user.CreatedAt,
	}
}

func (server *Server) setTokenCookies(
	ctx *gin.Context,
	accessToken string,
	accessTokenExpiresAt time.Time,
	refreshToken string,
	refreshTokenExpiresAt time.Time,
	sessionID uuid.UUID,
) {
	const cookiePath = "/"
	const httpOnly = true
	const secure = false

	ctx.SetCookie(
		"access_token",
		accessToken,
		int(time.Until(accessTokenExpiresAt).Seconds()),
		cookiePath, "", secure, httpOnly,
	)

	ctx.SetCookie(
		"access_token_expires_at",
		accessTokenExpiresAt.Format(time.RFC3339),
		int(time.Until(accessTokenExpiresAt).Seconds()),
		cookiePath, "", secure, httpOnly,
	)

	ctx.SetCookie(
		"refresh_token",
		refreshToken,
		int(time.Until(refreshTokenExpiresAt).Seconds()),
		cookiePath, "", secure, httpOnly,
	)

	ctx.SetCookie(
		"refresh_token_expires_at",
		refreshTokenExpiresAt.Format(time.RFC3339),
		int(time.Until(refreshTokenExpiresAt).Seconds()),
		cookiePath, "", secure, httpOnly,
	)

	ctx.SetCookie(
		"session_id",
		sessionID.String(),
		int(time.Until(refreshTokenExpiresAt).Seconds()),
		cookiePath, "", secure, httpOnly,
	)
}

func (server *Server) createUser(ctx *gin.Context) {
	var req createUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(errorResponse(http.StatusBadRequest, err))
		return
	}

	hashedPassword, err := util.HashPassword(req.Password)
	if err != nil {
		ctx.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	arg := db.CreateUserTxParams{
		CreateUserParams: db.CreateUserParams{
			Username:       req.Username,
			HashedPassword: hashedPassword,
			FullName:       req.FullName,
			Email:          req.Email,
		},
		AfterCreate: func(user db.User) error {
			taskPayload := &worker.PayloadSendVerifyEmail{
				Username: user.Username,
			}
			opts := []asynq.Option{
				asynq.MaxRetry(1),
				asynq.ProcessIn(1 * time.Second),
				asynq.Queue(worker.QueueAuth),
			}
			return server.taskDistributor.DistributeTaskSendVerifyEmail(ctx, taskPayload, opts...)
		},
	}

	txResult, err := server.store.CreateUserTx(ctx, arg)
	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code.Name() {
			case "unique_violation":
				ctx.JSON(errorResponse(http.StatusForbidden, err))
				return
			}
		}
		ctx.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	rsp := newUserResponse(txResult.User)
	ctx.JSON(http.StatusOK, rsp)
}

type loginUserRequest struct {
	Username string `json:"username" binding:"required,alphanum"`
	Password string `json:"password" binding:"required,min=6"`
}

type loginUserResponse struct {
	// SessionID             uuid.UUID    `json:"session_id"`
	// AccessToken           string       `json:"access_token"`
	// AccessTokenExpiresAt  time.Time    `json:"access_token_expires_at"`
	// RefreshToken          string       `json:"refresh_token"`
	// RefreshTokenExpiresAt time.Time    `json:"refresh_token_expires_at"`
	User userResponse `json:"user"`
}
type getUserResponse struct {
	User userResponse `json:"user"`
}

func (server *Server) loginUser(ctx *gin.Context) {
	var req loginUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(errorResponse(http.StatusBadRequest, err))
		return
	}

	user, err := server.store.GetUser(ctx, req.Username)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(errorResponse(http.StatusNotFound, err))
			return
		}
		ctx.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	err = util.CheckPassword(req.Password, user.HashedPassword)
	if err != nil {
		ctx.JSON(errorResponse(http.StatusUnauthorized, err))
		return
	}

	accessToken, accessPayload, err := server.tokenMaker.CreateToken(
		user.Username,
		server.config.ACCESS_TOKEN_DURATION,
	)

	if err != nil {
		ctx.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	refreshToken, refreshPayload, err := server.tokenMaker.CreateToken(
		user.Username,
		server.config.REFRESH_TOKEN_DURATION,
	)
	if err != nil {
		ctx.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	session, err := server.store.CreateSession(ctx, db.CreateSessionParams{
		ID:           refreshPayload.ID,
		Username:     user.Username,
		RefreshToken: refreshToken,
		UserAgent:    ctx.Request.UserAgent(),
		ClientIp:     ctx.ClientIP(),
		IsBlocked:    false,
		ExpiresAt:    refreshPayload.ExpiredAt,
	})
	if err != nil {
		ctx.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	server.setTokenCookies(ctx, accessToken, accessPayload.ExpiredAt, refreshToken, refreshPayload.ExpiredAt, session.ID)

	rsp := loginUserResponse{
		// SessionID:             session.ID,
		// AccessToken:           accessToken,
		// AccessTokenExpiresAt:  accessPayload.ExpiredAt,
		// RefreshToken:          refreshToken,
		// RefreshTokenExpiresAt: refreshPayload.ExpiredAt,
		User: newUserResponse(user),
	}
	ctx.JSON(http.StatusOK, rsp)
}

func (server *Server) GetUser(ctx *gin.Context) {

	authPayload := ctx.MustGet(AuthorizationPayloadKey).(*token.Payload)

	user, err := server.store.GetUser(ctx, authPayload.Username)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(errorResponse(http.StatusNotFound, err))
			return
		}
		ctx.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	rsp := getUserResponse{
		User: newUserResponse(user),
	}
	ctx.JSON(http.StatusOK, rsp)
}

package api

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// type renewAccessTokenResponse struct {
// 	AccessToken          string    `json:"access_token"`
// 	AccessTokenExpiresAt time.Time `json:"access_token_expires_at"`
// }

func (server *Server) renewAccessToken(ctx *gin.Context) {

	refreshToken, err := ctx.Cookie("refresh_token")
	if err != nil {
		err := fmt.Errorf("refresh token cookie is missing")
		ctx.JSON(errorResponse(http.StatusUnauthorized, err))
		return
	}

	refreshPayload, err := server.tokenMaker.VerifyToken(refreshToken)
	if err != nil {
		ctx.JSON(errorResponse(http.StatusUnauthorized, err))
		return
	}

	session, err := server.store.GetSession(ctx, refreshPayload.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(errorResponse(http.StatusNotFound, err))
			return
		}
		ctx.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	if session.IsBlocked {
		ctx.JSON(errorResponse(http.StatusUnauthorized, fmt.Errorf("blocked session")))
		return
	}

	if session.Username != refreshPayload.Username {
		ctx.JSON(errorResponse(http.StatusUnauthorized, fmt.Errorf("incorrect session user")))
		return
	}

	if session.RefreshToken != refreshToken {
		ctx.JSON(errorResponse(http.StatusUnauthorized, fmt.Errorf("mismatched session token")))
		return
	}

	if time.Now().After(session.ExpiresAt) {
		ctx.JSON(errorResponse(http.StatusUnauthorized, fmt.Errorf("expired session")))
		return
	}

	accessToken, accessPayload, err := server.tokenMaker.CreateToken(
		refreshPayload.Username,
		server.config.ACCESS_TOKEN_DURATION,
	)
	if err != nil {
		ctx.JSON(errorResponse(http.StatusInternalServerError, err))
		return
	}

	server.setAccessTokenCookie(ctx, accessToken, accessPayload.ExpiredAt)
	ctx.JSON(http.StatusOK, "Success")

	// rsp := renewAccessTokenResponse{
	// 	AccessToken:          accessToken,
	// 	AccessTokenExpiresAt: accessPayload.ExpiredAt,
	// }
	// ctx.JSON(http.StatusOK, rsp)
}

func (server *Server) setAccessTokenCookie(ctx *gin.Context, accessToken string, expiresAt time.Time) {
	const cookiePath = "/"
	const httpOnly = true
	const secure = false

	ctx.SetCookie(
		"access_token",
		accessToken,
		int(time.Until(expiresAt).Seconds()),
		cookiePath, "", secure, httpOnly,
	)

	ctx.SetCookie(
		"access_token_expires_at",
		expiresAt.Format(time.RFC3339),
		int(time.Until(expiresAt).Seconds()),
		cookiePath, "", secure, httpOnly,
	)
}

func (server *Server) LogoutUser(ctx *gin.Context) {
	ctx.SetCookie("access_token", "", -1, "/", "", false, true)
	ctx.SetCookie("refresh_token", "", -1, "/", "", false, true)

	ctx.JSON(errorResponse(http.StatusOK, errors.New("Logged out successfully")))
}

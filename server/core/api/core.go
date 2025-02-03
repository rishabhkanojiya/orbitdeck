package api

import (
	"database/sql"
	"errors"
	"fmt"
	"net/http"

	"github.com/rishabhkanojiya/orbitdeck/server/auth/api"
	"github.com/rishabhkanojiya/orbitdeck/server/auth/token"
	db "github.com/rishabhkanojiya/orbitdeck/server/core/db/sqlc"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type createCoreRequest struct {
	Currency string `json:"currency" binding:"required,currency"`
}

func (server *Server) createCore(ctx *gin.Context) {
	var req createCoreRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	authPayload := ctx.MustGet(api.AuthorizationPayloadKey).(*token.Payload)
	args := db.CreateCoreParams{
		Owner:    authPayload.Username,
		Currency: req.Currency,
		Balance:  0,
	}

	core, err := server.store.CreateCore(ctx, args)

	if err != nil {
		if pqErr, ok := err.(*pq.Error); ok {
			switch pqErr.Code.Name() {
			case "foreign_key_violation", "unique_violation":
				ctx.JSON(http.StatusForbidden, errorResponse(err))
				return
			}
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, core)

}

type getCoreRequest struct {
	ID int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) getCore(ctx *gin.Context) {
	var req getCoreRequest
	if err := ctx.ShouldBindUri(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	core, err := server.store.GetCore(ctx, req.ID)

	if err != nil {

		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))

		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	authPayload := ctx.MustGet(api.AuthorizationPayloadKey).(*token.Payload)
	if core.Owner != authPayload.Username {
		err := errors.New("core doesn't belong to the authenticated user")
		ctx.JSON(http.StatusUnauthorized, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, core)

}

type getCoresRequest struct {
	PageID   int32 `form:"page_id" binding:"required,min=1"`
	PageSize int32 `form:"page_size" binding:"required,min=5,max=10"`
}

func (server *Server) getCores(ctx *gin.Context) {
	var req getCoresRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	authPayload := ctx.MustGet(api.AuthorizationPayloadKey).(*token.Payload)
	args := db.ListCoresParams{
		Owner:  authPayload.Username,
		Limit:  req.PageSize,
		Offset: (req.PageID - 1) * req.PageSize,
	}
	fmt.Printf("%+v\n", args)

	core, err := server.store.ListCores(ctx, args)

	if err != nil {

		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, core)

}

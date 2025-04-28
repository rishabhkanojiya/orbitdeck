package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/rishabhkanojiya/orbitdeck/server/auth/util"
)

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		errors := c.Errors

		if len(errors) > 0 {
			err := errors[0].Err

			var errObj *util.Error
			switch e := err.(type) {
			case *util.Error:
				errObj = e
			default:
				errObj = &util.Error{
					Message: e.Error(),
				}
			}

			errorResponse := util.FormatErrorResponse(errObj)

			c.JSON(errorResponse.Status, errorResponse)
		}
	}
}

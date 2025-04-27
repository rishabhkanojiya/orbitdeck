package util

import (
	"fmt"
	"os"
)

type Error struct {
	Status        int
	ErrorCode     string
	CustomMessage string
	Message       string
	Name          string
	Stack         string
}

func (e *Error) Error() string {
	if e.Message != "" {
		return e.Message
	}
	return "unknown error"
}

type ErrorResponse struct {
	Message    string `json:"message"`
	Status     int    `json:"status"`
	Code       string `json:"code"`
	Exception  string `json:"exception"`
	StackTrace string `json:"stackTrace,omitempty"`
}

const DefaultErrorMessage = "An unexpected error occurred"

func FormatErrorResponse(err *Error) ErrorResponse {
	if err == nil {
		err = &Error{}
	}

	status := err.Status
	if status == 0 {
		status = 500
	}

	errorCode := err.ErrorCode
	if errorCode == "" {
		errorCode = "OD-" + intToString(status)
	}

	message := DefaultErrorMessage
	if status != 500 {
		if err.CustomMessage != "" {
			message = err.CustomMessage
		} else if err.Message != "" {
			message = err.Message
		}
	}

	errorResponse := ErrorResponse{
		Message:   message,
		Status:    status,
		Code:      errorCode,
		Exception: err.Name,
	}

	if os.Getenv("ENV") == "development" {
		errorResponse.StackTrace = err.Stack
	}

	return errorResponse
}

func intToString(num int) string {
	return fmt.Sprintf("%d", num)
}

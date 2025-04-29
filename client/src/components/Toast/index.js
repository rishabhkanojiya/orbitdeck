import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { ShowPopupContext } from "../../context";
import { Consume } from "../../context/Consumer";

const fadeInSlideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-30px) translateX(-50%);
  }
  100% {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
`;

const ToastWrapper = styled.div`
    position: fixed;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(28, 28, 30, 0.9);
    color: ${({ theme }) => theme.colors.textPrimary};
    padding: 16px 24px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    backdrop-filter: blur(10px);
    font-weight: 600;
    min-width: 320px;
    text-align: center;
    z-index: 9999;

    ${({ theme, severity }) => {
        const borderColor =
            severity === "success"
                ? theme.colors.success
                : severity === "error"
                ? theme.colors.error
                : theme.colors.warning;

        return `
      border: 2px solid ${borderColor};
      box-shadow: 0 0 20px ${borderColor};
      animation: fadeInSlideDown 0.5s ease forwards, pulseShadow 2s infinite;

      @keyframes pulseShadow {
        0% {
          box-shadow: 0 0 1px ${borderColor}, 0 0 10px ${borderColor}, 0 0 20px ${borderColor};
        }
        50% {
          box-shadow: 0 0 10px ${borderColor}, 0 0 20px ${borderColor}, 0 0 30px ${borderColor};
        }
        100% {
          box-shadow: 0 0 1px ${borderColor}, 0 0 10px ${borderColor}, 0 0 20px ${borderColor};
        }
      }
    `;
    }}

    @keyframes fadeInSlideDown {
        0% {
            opacity: 0;
            transform: translate(-50%, -20px);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }
`;

const ToastMessage = styled.div`
    font-size: 16px;
`;

const ToastContainer = styled.div`
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: center;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 9999;
`;

const Toast = ({ ShowPopupData }) => {
    const { showPopup, data, setShowPopup } = ShowPopupData;
    const { state, msg } = data;

    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => {
                setShowPopup(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showPopup]);

    if (!showPopup) return null;

    return (
        <ToastContainer>
            <ToastWrapper severity={state}>
                <ToastMessage>{msg}</ToastMessage>
            </ToastWrapper>
        </ToastContainer>
    );
};

export default Consume(Toast, [ShowPopupContext]);

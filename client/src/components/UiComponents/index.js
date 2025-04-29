import styled from "styled-components";

export const BackgroundOrbits = styled.div`
    position: absolute;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 1200px;
    height: 1200px;
    border: 1px solid rgba(168, 85, 247, 0.2);
    border-radius: 50%;
    animation: rotate 60s linear infinite;
    z-index: 0;
    pointer-events: none;

    @keyframes rotate {
        0% {
            transform: translateX(-50%) rotate(0deg);
        }
        100% {
            transform: translateX(-50%) rotate(360deg);
        }
    }
`;

export const BackgroundBlob = styled.div`
    position: absolute;
    width: 300px;
    height: 300px;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    filter: blur(150px);
    opacity: 0.2;
    z-index: 0;
`;

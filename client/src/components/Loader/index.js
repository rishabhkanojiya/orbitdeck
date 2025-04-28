import React from "react";
import styled, { keyframes } from "styled-components";

const Loader = () => {
    return (
        <Container>
            <Spinner />
        </Container>
    );
};

export default Loader;

const Container = styled.div`
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
    border: 4px solid ${({ theme }) => theme.colors.surface};
    border-top: 4px solid ${({ theme }) => theme.colors.secondary};
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: ${spin} 1s linear infinite;
`;

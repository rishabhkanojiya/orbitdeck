import styled from "styled-components";

export const PrimaryButton = styled.button`
    width: 100%;
    padding: 12px 16px;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    color: ${({ theme }) => theme.colors.textPrimary};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};
    /* box-shadow: ${({ theme }) => theme.colors.glowPrimary}; */

    &:hover {
        transform: scale(102%);
        background: ${({ theme }) => theme.colors.primaryHover};
        box-shadow: 0 0 20px ${({ theme }) => theme.colors.primaryHover};
    }
`;

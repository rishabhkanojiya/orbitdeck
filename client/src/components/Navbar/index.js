import React from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { useContext } from "react";
import { LoginContext } from "../../context";
import { routesObj } from "../../common/constants";
import { AuthService } from "../../services/auth.services";
import { Consume } from "../../context/Consumer";

const NavWrapper = styled.nav`
    width: 100%;
    background: rgba(28, 28, 30, 0.8);
    padding: 16px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(168, 85, 247, 0.2);
    z-index: 10;
    position: sticky;
    top: 0;
`;

const Brand = styled(Link)`
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-decoration: none;
`;

const NavLinks = styled.div`
    display: flex;
    gap: 24px;
`;

const NavItem = styled(Link)`
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    font-weight: 500;
    position: relative;

    &:hover {
        color: ${({ theme }) => theme.colors.textPrimary};
    }

    &::after {
        content: "";
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        height: 2px;
        bottom: -4px;
        left: 0;
        background: ${({ theme }) => theme.colors.primary};
        transform-origin: bottom right;
        transition: transform 0.3s ease-out;
    }

    &:hover::after {
        transform: scaleX(1);
        transform-origin: bottom left;
    }
`;

const UserSection = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`;

const UserName = styled.span`
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
`;

const LogoutBtn = styled.button`
    background: transparent;
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;

    &:hover {
        color: ${({ theme }) => theme.colors.textPrimary};
        box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
    }
`;

const AuthSection = styled.div`
    display: flex;
    gap: 16px;
`;

const AuthLink = styled(Link)`
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    font-weight: 500;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    padding: 6px 12px;
    border-radius: 6px;
    transition: 0.2s ease;

    &:hover {
        color: ${({ theme }) => theme.colors.textPrimary};
        box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
    }
`;

const Navbar = ({ fwdRef, LoginData }) => {
    const history = useHistory();
    const { data: userObj, setUserObj } = LoginData;

    const handleLogout = async () => {
        await AuthService.logout();
        setUserObj(null);
        history.push("/home");
    };

    return (
        <NavWrapper ref={fwdRef}>
            <Brand to="/">🪐 OrbitDeck</Brand>

            <NavLinks>
                <NavItem to={routesObj.home}>Home</NavItem>
                <NavItem to={routesObj.deploymentAdd}>Deploy</NavItem>
                <NavItem to={routesObj.analytics}>Analytics</NavItem>
                <NavItem to={routesObj.me}>Profile</NavItem>
            </NavLinks>

            {userObj ? (
                <UserSection>
                    <NavItem to={routesObj.me}>{userObj.username}</NavItem>
                    <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
                </UserSection>
            ) : (
                <AuthSection>
                    <AuthLink to="/auth/login">Login</AuthLink>
                    <AuthLink to="/auth/register">Sign Up</AuthLink>
                </AuthSection>
            )}
        </NavWrapper>
    );
};

export default Consume(Navbar, [LoginContext]);

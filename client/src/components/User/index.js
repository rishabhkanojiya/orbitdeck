import React from "react";
import styled from "styled-components";
import { Consume } from "../../context/Consumer";
import { LoginContext } from "../../context";
import { AuthService } from "../../services/auth.services";
import { useHistory } from "react-router-dom";
import { PrimaryButton } from "../Button";

const PageWrapper = styled.div`
    position: relative;
    min-height: 100vh;
    padding: 100px 20px 40px;
    background: radial-gradient(circle at top, #1c1c1e 0%, #0e0e10 70%);
    color: ${({ theme }) => theme.colors.textPrimary};
`;

const Container = styled.div`
    max-width: 600px;
    margin: 0 auto;
    background: rgba(28, 28, 30, 0.6);
    backdrop-filter: blur(10px);
    padding: 32px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h1`
    font-size: 28px;
    font-weight: 700;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 20px;
`;

const InfoLine = styled.div`
    margin-bottom: 14px;
    font-size: 15px;
    span {
        font-weight: 600;
        color: ${({ theme }) => theme.colors.primary};
        margin-right: 8px;
    }
`;

const LogoutButton = styled(PrimaryButton)`
    margin-top: 24px;
`;

const ProfilePage = ({ LoginData }) => {
    const history = useHistory();
    const user = LoginData?.data;

    const logout = async () => {
        try {
            await AuthService.logout();
            LoginData.setUserObj(null);
            history.push("/auth/login");
        } catch (err) {
            alert("Failed to logout.");
        }
    };

    if (!user) return null;

    return (
        <>
            <PageWrapper>
                <Container>
                    <Title>Your Profile</Title>

                    <InfoLine>
                        <span>Name:</span> {user.full_name || "N/A"}
                    </InfoLine>

                    <InfoLine>
                        <span>Username:</span> {user.username}
                    </InfoLine>

                    <InfoLine>
                        <span>Email:</span> {user.email}
                    </InfoLine>

                    {user.created_at && (
                        <InfoLine>
                            <span>Joined:</span>{" "}
                            {new Date(user.created_at).toLocaleDateString()}
                        </InfoLine>
                    )}

                    {user.deployments_count && (
                        <InfoLine>
                            <span>Deployments:</span> {user.deployments_count}
                        </InfoLine>
                    )}

                    <LogoutButton onClick={logout}>Log Out</LogoutButton>
                </Container>
            </PageWrapper>
        </>
    );
};

export default Consume(ProfilePage, [LoginContext]);

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import FloatingIcons from "../FloatingIcons";
import { Consume } from "../../context/Consumer";
import { LoginContext } from "../../context";
import { routesObj } from "../../common/constants";
import { BackgroundBlob, BackgroundOrbits } from "../UiComponents";
import { DeploymentService } from "../../services/deployment.services";
import Dashboard from "./Dashboard";

const PageWrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    background: radial-gradient(circle at top, #1c1c1e 0%, #0e0e10 70%);
    color: ${({ theme }) => theme.colors.textPrimary};
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
    position: relative;
`;

const HeroSection = styled.section`
    width: 100%;
    padding: 120px 20px 60px;
    text-align: center;
    position: relative;
    z-index: 1;
`;

const HeroTitle = styled.h1`
    font-size: 48px;
    font-weight: 700;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 20px;
`;

const HeroSubtitle = styled.p`
    font-size: 20px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: 40px;
`;

const CTAButton = styled(Link)`
    padding: 14px 32px;
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.gradientPrimary};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background: ${({ theme }) => theme.colors.primaryHover};
        box-shadow: 0 0 20px ${({ theme }) => theme.colors.primaryHover};
        transform: translateY(-2px);
    }
`;

const FeaturesSection = styled.section`
    width: 100%;
    max-width: 1200px;
    padding: 60px 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    justify-content: center;
    position: relative;
    z-index: 1;
`;

const FeatureCard = styled.div`
    background: rgba(28, 28, 30, 0.6);
    backdrop-filter: blur(10px);
    padding: 40px 24px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    width: 280px;
    text-align: center;
    border: 2px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(#1c1c1e, #1c1c1e),
        ${({ theme }) => theme.colors.gradientPrimary};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transition: ${({ theme }) => theme.transitions.default};
    opacity: ${({ comingSoon }) => (comingSoon ? 0.6 : 1)};
    pointer-events: ${({ comingSoon }) => (comingSoon ? "none" : "auto")};

    &:hover {
        box-shadow: ${({ theme, comingSoon }) =>
            comingSoon ? theme.shadows.md : theme.colors.glowPrimary};
        transform: ${({ comingSoon }) =>
            comingSoon ? "none" : "translateY(-8px) scale(1.03)"};
    }
`;

const ComingSoonBadge = styled.div`
    position: absolute;
    top: 12px;
    right: 12px;
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textPrimary};
    padding: 4px 8px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
`;

const FeatureTitle = styled.h3`
    margin-bottom: 16px;
    font-size: 24px;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const FeatureDesc = styled.p`
    font-size: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-top: 12px;
`;

const CTASection = styled.section`
    width: 100%;
    padding: 60px 20px;
    text-align: center;
    position: relative;
    z-index: 1;
`;

const CTAHeading = styled.h2`
    font-size: 36px;
    margin-bottom: 20px;
`;

const Footer = styled.footer`
    width: 100%;
    padding: 20px;
    text-align: center;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    backdrop-filter: blur(6px);
    margin-top: auto;
`;

const FooterLink = styled(Link)`
    color: ${({ theme }) => theme.colors.primary};
    margin: 0 8px;
    text-decoration: none;
    font-weight: 500;

    &:hover {
        text-decoration: underline;
    }
`;

const HomePage = ({ LoginData }) => {
    const [deployments, setDeployments] = useState([]);

    const fetchDeployments = async () => {
        try {
            const res = await DeploymentService.getMyDeployments({
                pageSize: 9,
            });
            setDeployments(res.data);
        } catch (err) {
            console.error("Failed to fetch deployments", err);
        }
    };

    useEffect(() => {
        if (LoginData?.data?.username) {
            fetchDeployments();
        }
    }, [LoginData?.data?.username]);

    const isLoggedIn = !!LoginData?.data?.username;

    return (
        <>
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                <FloatingIcons />
            </div>
            <PageWrapper>
                <BackgroundOrbits />
                <BackgroundBlob style={{ top: "150px", left: "10%" }} />
                <BackgroundBlob style={{ top: "600px", right: "15%" }} />

                <HeroSection>
                    <HeroTitle>Deploy Faster. Scale Smarter.</HeroTitle>
                    <HeroSubtitle>
                        {isLoggedIn
                            ? "Manage your deployments effortlessly with OrbitDeck."
                            : "The easiest platform to launch, manage, and scale your apps effortlessly."}
                    </HeroSubtitle>
                    {isLoggedIn ? (
                        <CTAButton to={routesObj.deploymentAdd}>
                            Deploy New App
                        </CTAButton>
                    ) : (
                        <CTAButton to={`${routesObj.auth}/login`}>
                            Get Started
                        </CTAButton>
                    )}
                </HeroSection>

                {isLoggedIn && <Dashboard />}

                <FeaturesSection>
                    <FeatureCard>
                        <FeatureTitle>One-Click Deployments</FeatureTitle>
                        <FeatureDesc>
                            Launch your apps from GitHub or GitLab in seconds
                            with automated pipelines.
                        </FeatureDesc>
                    </FeatureCard>

                    <FeatureCard>
                        <FeatureTitle>Managed Databases</FeatureTitle>
                        <FeatureDesc>
                            Provision PostgreSQL, MongoDB, and Redis services
                            with zero config.
                        </FeatureDesc>
                    </FeatureCard>

                    <FeatureCard comingSoon>
                        <ComingSoonBadge>Coming Soon</ComingSoonBadge>
                        <FeatureTitle>Auto-scaling & Monitoring</FeatureTitle>
                        <FeatureDesc>
                            Scale dynamically with traffic and monitor real-time
                            metrics.
                        </FeatureDesc>
                    </FeatureCard>

                    <FeatureCard comingSoon>
                        <ComingSoonBadge>Coming Soon</ComingSoonBadge>
                        <FeatureTitle>SSL & Domains</FeatureTitle>
                        <FeatureDesc>
                            Free SSL certificates and easy custom domain linking
                            built-in.
                        </FeatureDesc>
                    </FeatureCard>
                </FeaturesSection>

                {!isLoggedIn && (
                    <CTASection>
                        <CTAHeading>
                            Join the OrbitDeck Revolution 🚀
                        </CTAHeading>
                        <CTAButton to="/auth/register">Sign Up Now</CTAButton>
                    </CTASection>
                )}

                <Footer>
                    &copy; {new Date().getFullYear()} OrbitDeck
                    {LoginData?.data?.username && (
                        <>
                            {" "}
                            —<FooterLink to="/me">Profile</FooterLink>
                        </>
                    )}
                </Footer>
            </PageWrapper>
        </>
    );
};

export default Consume(HomePage, [LoginContext]);

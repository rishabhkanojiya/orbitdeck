import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import FloatingIcons from "../FloatingIcons";
import { PrimaryButton } from "../Button";

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

const BackgroundOrbits = styled.div`
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

const BackgroundBlob = styled.div`
    position: absolute;
    width: 300px;
    height: 300px;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    filter: blur(150px);
    opacity: 0.2;
    z-index: 0;
`;

/* Main Sections */
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
    /* box-shadow: ${({ theme }) => theme.colors.glowPrimary}; */
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
    border: 1px solid transparent;
    background-clip: padding-box, border-box;
    background-origin: padding-box, border-box;
    background-image: linear-gradient(#1c1c1e, #1c1c1e),
        ${({ theme }) => theme.colors.gradientPrimary};
    box-shadow: ${({ theme }) => theme.shadows.md};
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        box-shadow: ${({ theme }) => theme.colors.glowPrimary};
        transform: translateY(-8px) scale(1.03);
    }
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

const FeatureIcon = styled.div`
    font-size: 36px;
    margin-bottom: 16px;
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
`;

const HomePage = () => {
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
                        The easiest platform to launch, manage, and scale your
                        apps effortlessly.
                    </HeroSubtitle>
                    <CTAButton to="/auth/register">Get Started</CTAButton>
                </HeroSection>

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

                    <FeatureCard>
                        <FeatureTitle>Auto-scaling & Monitoring</FeatureTitle>
                        <FeatureDesc>
                            Scale dynamically with traffic and monitor real-time
                            metrics.
                        </FeatureDesc>
                    </FeatureCard>

                    <FeatureCard>
                        <FeatureTitle>SSL & Domains</FeatureTitle>
                        <FeatureDesc>
                            Free SSL certificates and easy custom domain linking
                            built-in.
                        </FeatureDesc>
                    </FeatureCard>
                </FeaturesSection>

                <CTASection>
                    <CTAHeading>Join the OrbitDeck Revolution 🚀</CTAHeading>
                    <CTAButton to="/auth/register">Sign Up Now</CTAButton>
                </CTASection>

                <Footer>
                    © {new Date().getFullYear()} OrbitDeck. All rights reserved.
                </Footer>
            </PageWrapper>
        </>
    );
};

export default HomePage;

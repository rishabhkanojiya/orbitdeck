import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import styled from "styled-components";
import { skillIconUrls, terminalStates } from "../../../common/constants";
import { DeploymentService } from "../../../services/deployment.services";
import { PrimaryButton } from "../../Button";
import { Consume } from "../../../context/Consumer";
import { ShowPopupContext } from "../../../context";

const PageWrapper = styled.div`
    position: relative;
    width: 100%;
    min-height: 100vh;
    padding: 80px 20px 40px;
    background: radial-gradient(circle at top, #1c1c1e 0%, #0e0e10 70%);
    color: ${({ theme }) => theme.colors.textPrimary};
    z-index: 1;
`;

const Container = styled.div`
    max-width: 900px;
    margin: 0 auto;
    background: rgba(28, 28, 30, 0.6);
    backdrop-filter: blur(10px);
    padding: 32px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: ${({ theme }) => theme.shadows.md};
`;

const TitleRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 12px;
`;

const Title = styled.h1`
    font-size: 28px;
    font-weight: 700;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const StatusBadge = styled.span`
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: white;
    background-color: ${({ status }) =>
        status === "installed"
            ? "#22c55e"
            : status === "installing"
            ? "#facc15"
            : status === "failed"
            ? "#ef4444"
            : "#444"};
    box-shadow: 0 0 8px
        ${({ status }) =>
            status === "installed"
                ? "#22c55eaa"
                : status === "installing"
                ? "#facc15aa"
                : status === "failed"
                ? "#ef4444aa"
                : "#777"};
`;

const SubInfo = styled.div`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-top: 4px;
`;

const Section = styled.div`
    margin-top: 24px;
`;

const SectionTitle = styled.h3`
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
`;

const CodeBox = styled.pre`
    background: rgba(255, 255, 255, 0.05);
    padding: 12px;
    border-radius: 8px;
    font-size: 14px;
    overflow-x: auto;
    margin-bottom: 10px;
`;

const LogoStack = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 12px;
`;

const Logo = styled.img`
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 0 4px #a855f7);
`;

const BackLink = styled.span`
    display: inline-block;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
    cursor: pointer;
    margin-bottom: 16px;
`;

const LiveStatusBadge = styled.div`
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: white;
    background-color: #9333ea;
    animation: pulseShadow 1.5s infinite ease-in-out;

    @keyframes pulseShadow {
        0% {
            box-shadow: 0 0 10px #9333ea, 0 0 20px #9333ea;
        }
        50% {
            box-shadow: 0 0 20px #9333ea, 0 0 40px #9333ea;
        }
        100% {
            box-shadow: 0 0 10px #9333ea, 0 0 20px #9333ea;
        }
    }
`;

const DeploymentDetail = ({ ShowPopupData }) => {
    const { id } = useParams();
    const history = useHistory();
    const [deployment, setDeployment] = useState(null);
    const [liveStatus, setLiveStatus] = useState(null);
    const [polling, setPolling] = useState(true);

    useEffect(() => {
        DeploymentService.getDeploymentById({ deploymentId: id })
            .then((res) => {
                setDeployment(res.data);
            })
            .catch(() => {
                history.push("/");
            });
    }, [id]);

    useEffect(() => {
        if (!deployment || !polling) return;

        const interval = setInterval(async () => {
            try {
                const res = await DeploymentService.getDeploymentStatus({
                    deploymentId: id,
                });
                const statusName = res.data.state || "unknown";
                setLiveStatus(statusName);

                if (terminalStates.has(statusName)) {
                    setPolling(false);

                    DeploymentService.getDeploymentById({ deploymentId: id })
                        .then((res) => setDeployment(res.data))
                        .catch((err) =>
                            console.error("Failed to refresh deployment:", err),
                        );
                }
            } catch (err) {
                console.error("Polling error:", err);
                setPolling(false);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [deployment, polling]);

    useEffect(() => {
        if (deployment?.Status?.toLowerCase() === "installed") {
            setPolling(false);
        }
    }, [deployment]);

    const uninstall = async () => {
        try {
            await DeploymentService.uninstallDeployment({ deploymentId: id });

            ShowPopupData.setPopupMessageObj(
                { message: "Deployment Uninstalled Successfully" },
                "success",
            );
            history.push("/");
        } catch (err) {
            alert("Uninstall failed");
        }
    };

    if (!deployment) return null;

    return (
        <>
            <PageWrapper>
                <Container>
                    <BackLink onClick={() => history.goBack()}>
                        &larr; Back
                    </BackLink>

                    <TitleRow>
                        <Title>{deployment?.Name}</Title>

                        {polling ? (
                            <LiveStatusBadge>{`Live: ${
                                liveStatus || "..."
                            }`}</LiveStatusBadge>
                        ) : (
                            <StatusBadge
                                status={deployment.Status?.toLowerCase()}
                            >
                                {deployment.Status}
                            </StatusBadge>
                        )}
                    </TitleRow>
                    {/*
                    <SubInfo>
                        {polling
                            ? `Live Queue Status: ${liveStatus ?? "loading"}`
                            : `Final Status: ${deployment?.Status}`}
                    </SubInfo> */}

                    <Section>
                        <SectionTitle>Helm Release</SectionTitle>
                        <CodeBox>{deployment?.HelmRelease}</CodeBox>
                    </Section>

                    <Section>
                        <SectionTitle>Ingress</SectionTitle>
                        <CodeBox>
                            {deployment?.Ingress?.map(
                                (ing, i) =>
                                    `${ing.Host}${ing.Path} → ${ing.ServiceName}:${ing.ServicePort}\n`,
                            )}
                        </CodeBox>
                    </Section>

                    <Section>
                        <SectionTitle>Components</SectionTitle>
                        {deployment?.Components?.map((comp, i) => (
                            <CodeBox key={i}>
                                Name: {comp.Name}
                                {"\n"}Image: {comp.Image.Repository}:
                                {comp.Image.Tag}
                                {"\n"}Replicas: {comp.ReplicaCount}
                                {"\n"}Resources:
                                {"\n"} CPU: {comp.Resources.Requests.CPU} →{" "}
                                {comp.Resources.Limits.CPU}
                                {"\n"} Memory: {comp.Resources.Requests.Memory}{" "}
                                → {comp.Resources.Limits.Memory}
                                {"\n"}Env:
                                {comp.Env.map(
                                    (env) => `\n  ${env.key}=${env.value}`,
                                )}
                            </CodeBox>
                        ))}
                        <LogoStack>
                            {deployment?.Components?.map((comp) => {
                                const key = Object.keys(skillIconUrls).find(
                                    (k) =>
                                        comp.Image.Repository.toLowerCase().includes(
                                            k,
                                        ),
                                );
                                return key ? (
                                    <Logo
                                        key={key}
                                        src={skillIconUrls[key]}
                                        alt={key}
                                    />
                                ) : null;
                            })}
                        </LogoStack>
                    </Section>

                    <Section>
                        <PrimaryButton onClick={uninstall}>
                            Uninstall Deployment
                        </PrimaryButton>
                    </Section>
                </Container>
            </PageWrapper>
        </>
    );
};

export default Consume(DeploymentDetail, [ShowPopupContext]);

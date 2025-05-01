import React from "react";
import styled from "styled-components";
import { useContext } from "react";
import { DeploymentService } from "../../services/deployment.services";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { skillIconUrls } from "../../common/constants";
import Pagination from "../Pagination";
import { ShowPopupContext } from "../../context";

const SectionWrapper = styled.section`
    width: 100%;
    max-width: 1200px;
    margin: 60px auto;
    padding: 20px;
    position: relative;
    z-index: 2;
`;

const Heading = styled.h2`
    font-size: 32px;
    text-align: center;
    margin-bottom: 40px;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
`;

const Card = styled.div`
    background: rgba(28, 28, 30, 0.6);
    backdrop-filter: blur(10px);
    padding: 24px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    border: 1px solid rgba(168, 85, 247, 0.2);
    box-shadow: ${({ theme }) => theme.shadows.md};
    text-align: left;
    position: relative;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        box-shadow: ${({ theme }) => theme.colors.glowPrimary};
        transform: translateY(-4px);
    }
`;

const CardHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;
`;

const CardTitle = styled.h3`
    font-size: 20px;
    margin-bottom: 8px;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const SubInfo = styled.p`
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 4px 0;
`;

const LogoStack = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 16px;
    align-items: center;
    flex-wrap: wrap;
`;

const Logo = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 6px;
    filter: drop-shadow(0 0 3px #a855f7);
`;

const EmptyState = styled.div`
    text-align: center;
    font-size: 16px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-top: 40px;
`;

const StatusBadge = styled.span`
    display: inline-block;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: white;

    background-color: ${
        ({ status }) =>
            status === "installed"
                ? "#22c55e" // green
                : status === "installing"
                ? "#facc15" // yellow
                : "#ef4444" // red
    };
    box-shadow: 0 0 8px
        ${({ status }) =>
            status === "installed"
                ? "#22c55eaa"
                : status === "installing"
                ? "#facc15aa"
                : "#ef4444aa"};
`;

const formatDate = (iso) => {
    try {
        return format(new Date(iso), "MMM dd, yyyy • HH:mm");
    } catch {
        return "";
    }
};

const extractSkillIcons = (components) => {
    const seen = new Set();

    // return ["postgres", "mongodb", "redis"];
    return components
        .map((c) => {
            const name = c.Image.Repository.toLowerCase();
            const key = Object.keys(skillIconUrls).find((k) =>
                name.includes(k),
            );

            return key && !seen.has(key) ? (seen.add(key), key) : null;
        })
        .filter(Boolean);
};

const Dashboard = () => {
    const { setPopupMessageObj } = useContext(ShowPopupContext);

    const fetchDeployments = async ({ pageNo, pageSize = 10 }) => {
        try {
            const response = await DeploymentService.getMyDeployments({
                pageNo,
                pageSize,
            });
            return {
                data: response.data,
            };
        } catch (error) {
            setPopupMessageObj(
                { message: "Failed to load deployments" },
                "error",
            );
            return {
                data: { items: [], page: { current: 1, hasNext: false } },
            };
        }
    };

    return (
        <SectionWrapper>
            <Heading>Your Deployments</Heading>

            <Pagination
                data={{ items: [], page: { current: 1, hasNext: true } }}
                Service={fetchDeployments}
            >
                {({ items }) =>
                    items.length ? (
                        <>
                            <Grid>
                                {items.map((d) => (
                                    <Link
                                        to={`/deployment/${d.ID}`}
                                        style={{
                                            textDecoration: "none",
                                            color: "inherit",
                                        }}
                                    >
                                        <Card key={d.ID}>
                                            <CardHeader>
                                                <CardTitle>{d.Name}</CardTitle>
                                                <StatusBadge
                                                    status={d.Status?.toLowerCase()}
                                                >
                                                    {d.Status}
                                                </StatusBadge>
                                            </CardHeader>
                                            <SubInfo>
                                                Env: {d.Environment}
                                            </SubInfo>
                                            <SubInfo>
                                                Helm: {d.HelmRelease}
                                            </SubInfo>
                                            <SubInfo>
                                                Created:{" "}
                                                {formatDate(d.CreatedAt?.Time)}
                                            </SubInfo>

                                            {d.Components?.length > 0 && (
                                                <LogoStack>
                                                    {extractSkillIcons(
                                                        d.Components,
                                                    ).map((key) => (
                                                        <Logo
                                                            key={key}
                                                            src={
                                                                skillIconUrls[
                                                                    key
                                                                ]
                                                            }
                                                            alt={key}
                                                        />
                                                    ))}
                                                </LogoStack>
                                            )}
                                        </Card>
                                    </Link>
                                ))}
                            </Grid>
                        </>
                    ) : (
                        <EmptyState>No deployments yet.</EmptyState>
                    )
                }
            </Pagination>
        </SectionWrapper>
    );
};

export default Dashboard;

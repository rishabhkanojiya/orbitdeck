import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { BackgroundBlob } from "../UiComponents";
import { CustomDropdown } from "../CustomDropdown";
import { Consume } from "../../context/Consumer";
import { LoginContext } from "../../context";

import { DeploymentService } from "../../services/deployment.services";
import { AnalyticsService } from "../../services/analytics.service";
import { timelineOptions } from "../../common/constants";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

const PageWrapper = styled.div`
    padding: 40px;
    max-width: 1200px;
    margin: auto;
    color: white;
`;

const Section = styled.section`
    margin-top: 40px;
`;

const Header = styled.h2`
    margin-bottom: 10px;
`;

const SectionGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 30px;
`;

const Card = styled.div`
    background: rgba(255, 255, 255, 0.05);
    padding: 24px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(138, 43, 226, 0.2);
    box-shadow: 0 0 12px rgba(138, 43, 226, 0.4);
`;

const EventSectionCard = styled(Card)`
    padding: 16px 24px;
    max-height: 300px;
    overflow-y: auto;

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        margin-bottom: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-left: 4px solid #8a2be2;
        border-radius: 8px;
        font-size: 14px;

        &:hover {
            background: rgba(255, 255, 255, 0.07);
        }
    }

    b {
        color: #e0c3fc;
    }

    .event-type {
        display: inline-block;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 6px;
        background: #8a2be2;
        color: white;
        margin-right: 8px;
        text-transform: uppercase;
    }

    .error-status {
        background: #e53935;
    }

    time {
        display: block;
        font-size: 12px;
        color: #aaa;
        margin-top: 4px;
    }
`;

const AnalyticsPage = ({ LoginData }) => {
    const userEmail = LoginData?.data?.username;

    const [deployments, setDeployments] = useState({ active: 0, total: 0 });
    const [stats, setStats] = useState({ repos: [], components: [] });
    const [events, setEvents] = useState({ recent: [], errors: [] });
    const [timeline, setTimeline] = useState([]);
    const [selectedTimeline, setSelectedTimeline] = useState(
        timelineOptions[2],
    );

    const fetchData = useCallback(async () => {
        const [depRes, statsRes, compRes, eventsRes, errRes] =
            await Promise.all([
                DeploymentService.getMyDeployments({}),
                AnalyticsService.getStats({ userEmail }),
                AnalyticsService.getTopComponents({ userEmail }),
                AnalyticsService.getRecentEvents({ userEmail }),
                AnalyticsService.getErrorEvents({ userEmail }),
            ]);

        const deployments = depRes.data.items || [];
        setDeployments({
            total: deployments.length,
            active: deployments.filter((d) => d.status === "installed").length,
        });

        setStats({
            repos: statsRes.data.topRepos || [],
            components: compRes.data || [],
        });

        setEvents({
            recent: eventsRes.data || [],
            errors: errRes.data || [],
        });
    }, [userEmail]);

    const fetchTimeline = useCallback(async () => {
        const res = await AnalyticsService.getEventTimeline({
            userEmail,
            interval: selectedTimeline.value,
        });
        setTimeline(res.data || []);
    }, [selectedTimeline]);

    useEffect(() => {
        fetchData();
        fetchTimeline();

        const interval = setInterval(() => {
            DeploymentService.getMyDeployments({}).then((res) => {
                const deployments = res.data.items || [];
                setDeployments({
                    total: deployments.length,
                    active: deployments.filter((d) => d.status === "installed")
                        .length,
                });
            });

            AnalyticsService.getErrorEvents({ userEmail }).then((res) => {
                setEvents((prev) => ({ ...prev, errors: res.data || [] }));
            });
        }, 10000);

        return () => clearInterval(interval);
    }, [fetchData, fetchTimeline]);

    useEffect(() => {
        fetchTimeline();
    }, [selectedTimeline, fetchTimeline]);

    const chartData = {
        labels: timeline.map((point) => point.day),
        datasets: [
            {
                label: "Events",
                data: timeline.map((point) => point.count),
                backgroundColor: "rgba(138, 43, 226, 0.7)",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: "Events Over Time" },
        },
    };

    const formatDate = (ts) => new Date(ts).toLocaleString();

    return (
        <PageWrapper>
            <BackgroundBlob style={{ top: "150px", left: "10%" }} />
            <BackgroundBlob style={{ top: "600px", right: "15%" }} />

            <h1>🚀 OrbitDeck Analytics</h1>

            <SectionGrid>
                <Card>
                    <Header>📦 Active Deployments</Header>
                    <p>{deployments.active}</p>
                </Card>
                <Card>
                    <Header>📊 Total Deployments</Header>
                    <p>{deployments.total}</p>
                </Card>
                <Card>
                    <Header>🔥 Recent Errors</Header>
                    <p>{events.errors.length}</p>
                </Card>
            </SectionGrid>

            <Section>
                <Header>📈 Deployment Activity Timeline</Header>
                <CustomDropdown
                    options={timelineOptions}
                    selected={selectedTimeline}
                    onSelect={setSelectedTimeline}
                />
                <Bar data={chartData} options={chartOptions} />
            </Section>

            <SectionGrid>
                <Card>
                    <Header>🏆 Top Repositories</Header>
                    <ul>
                        {stats.repos.map((r, i) => (
                            <li key={i}>
                                {r.name} — {r.count}
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card>
                    <Header>🧱 Top Components</Header>
                    <ul>
                        {stats.components.map((c, i) => (
                            <li key={i}>
                                {c.component} — {c.count}
                            </li>
                        ))}
                    </ul>
                </Card>
            </SectionGrid>

            <Section>
                <Header>📜 Recent Events</Header>
                <EventSectionCard>
                    <ul>
                        {events.recent.map((e) => (
                            <li key={e.id}>
                                <span className="event-type">
                                    {e.eventType}
                                </span>
                                <b>{e.repository || e.component}</b>
                                <time>{formatDate(e.timestamp)}</time>
                            </li>
                        ))}
                    </ul>
                </EventSectionCard>
            </Section>

            {events.errors.length > 0 && (
                <Section>
                    <Header>❌ Error Events (Live)</Header>
                    <EventSectionCard>
                        <ul>
                            {events.errors.map((e) => (
                                <li key={e.id}>
                                    <span className="event-type error-status">
                                        {e.status}
                                    </span>
                                    <b>{e.repository || e.component}</b>
                                    <time>{formatDate(e.timestamp)}</time>
                                </li>
                            ))}
                        </ul>
                    </EventSectionCard>
                </Section>
            )}
        </PageWrapper>
    );
};

export default Consume(AnalyticsPage, [LoginContext]);

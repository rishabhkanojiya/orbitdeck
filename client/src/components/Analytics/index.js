import React, { useEffect, useState } from "react";
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

import { DeploymentService } from "../../services/deployment.services";
import { AnalyticsService } from "../../services/analytics.service";
import { timelineOptions } from "../../common/constants";
import { CustomDropdown } from "../CustomDropdown";

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
    position: relative;

    ul {
        list-style: none;
        padding-left: 0;
        margin: 0;
    }

    li {
        margin-bottom: 12px;
        padding: 12px;
        background: rgba(255, 255, 255, 0.03);
        border-left: 4px solid #8a2be2;
        border-radius: 8px;
        font-size: 14px;
        transition: background 0.3s ease;

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

const AnalyticsPage = () => {
    const [activeCount, setActiveCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [topRepos, setTopRepos] = useState([]);
    const [topComponents, setTopComponents] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);
    const [errors, setErrors] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [selectedTimeline, setSelectedTimeline] = useState(
        timelineOptions[2],
    );

    const fetchDeployments = async () => {
        const res = await DeploymentService.getMyDeployments({});
        const items = res.data.items || [];
        setTotalCount(items.length);
        setActiveCount(items.filter((d) => d.status === "installed").length);
    };

    const fetchStats = async () => {
        const res = await AnalyticsService.getStats();
        setTopRepos(res.data.topRepos || []);
    };

    const fetchTopComponents = async () => {
        const res = await AnalyticsService.getTopComponents();
        setTopComponents(res.data || []);
    };

    const fetchRecentEvents = async () => {
        const res = await AnalyticsService.getRecentEvents();
        setRecentEvents(res.data || []);
    };

    const fetchErrors = async () => {
        const res = await AnalyticsService.getErrorEvents();
        setErrors(res.data || []);
    };

    const fetchTimeline = async (range = selectedTimeline.value) => {
        const res = await AnalyticsService.getEventTimeline({
            interval: range,
        });
        setTimeline(res.data || []);
    };

    useEffect(() => {
        fetchDeployments();
        fetchStats();
        fetchTopComponents();
        fetchRecentEvents();
        fetchErrors();
        fetchTimeline(selectedTimeline.value); // 👈 Pass the current range

        const interval = setInterval(() => {
            fetchDeployments();
            fetchErrors();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchTimeline(selectedTimeline.value);
    }, [selectedTimeline]);

    const timelineChartData = {
        labels: timeline.map((point) => point.day),
        datasets: [
            {
                label: "Events",
                data: timeline.map((point) => point.count),
                backgroundColor: "rgba(138, 43, 226, 0.7)",
            },
        ],
    };

    const timelineChartOptions = {
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
                    <p>{activeCount}</p>
                </Card>
                <Card>
                    <Header>📊 Total Deployments</Header>
                    <p>{totalCount}</p>
                </Card>
                <Card>
                    <Header>🔥 Recent Errors</Header>
                    <p>{errors.length}</p>
                </Card>
            </SectionGrid>

            <Section>
                <Header>📈 Deployment Activity Timeline</Header>
                <CustomDropdown
                    options={timelineOptions}
                    selected={selectedTimeline}
                    onSelect={setSelectedTimeline}
                />

                <Bar data={timelineChartData} options={timelineChartOptions} />
            </Section>

            <SectionGrid>
                <Card>
                    <Header>🏆 Top Repositories</Header>
                    <ul>
                        {topRepos.map((repo, idx) => (
                            <li key={idx}>
                                {repo.name} — {repo.count}
                            </li>
                        ))}
                    </ul>
                </Card>
                <Card>
                    <Header>🧱 Top Components</Header>
                    <ul>
                        {topComponents.map((c, idx) => (
                            <li key={idx}>
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
                        {recentEvents.map((e) => (
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

            <Section>
                <Header>❌ Error Events (Live)</Header>
                {errors?.length ? (
                    <EventSectionCard>
                        <ul>
                            {errors?.map((e) => (
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
                ) : (
                    <></>
                )}
            </Section>
        </PageWrapper>
    );
};

export default AnalyticsPage;

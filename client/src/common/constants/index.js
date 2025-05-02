import { getSkillIcons } from "../utils";

export const routesObj = {
    auth: "/auth",
    home: "/",
    deploymentId: "/deployment/:id",
    deploymentAdd: "/deployment/add",
    me: "/me",
    analytics: "/analytics",
};

export const tech = [
    "js",
    "ts",
    "react",
    "nextjs",
    "nodejs",
    "express",
    "prisma",
    "postgres",
    "redis",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "git",
    "github",
    "githubactions",
    "tailwind",
    "vite",
    "graphql",
    "mysql",
    "mongodb",
    "flutter",
    "py",
    "django",
    "fastapi",
    "vercel",
    "supabase",
    "jest",
];

export const skillIconUrls = {
    postgres: getSkillIcons("postgres"),
    mongodb: getSkillIcons("mongodb"),
    redis: getSkillIcons("redis"),
    mysql: getSkillIcons("mysql"),
    grafana: getSkillIcons("grafana"),
    sentry: getSkillIcons("sentry"),
    rabbitmq: getSkillIcons("rabbitmq"),
};

export const queueEnums = {
    1: "pending",
    2: "active",
    3: "scheduled",
    4: "retry",
    5: "archived",
    6: "completed",
};

export const terminalStates = new Set(["retry", "archived", "completed"]);

export const timelineOptions = [
    { label: "Past Hour (by Minute)", value: "minute" },
    { label: "Today (by Hour)", value: "hour" },
    { label: "Last 30 Days", value: "day" },
    { label: "Last 3 Months (by Week)", value: "week" },
];

import { getSkillIcons } from "../utils";

export const routesObj = {
    auth: "/auth",
    home: "/",
    deploymentId: "/deployment/:id",
    deploymentAdd: "/deployment/add",
    me: "/me",
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

const queueEnums = {
    1: "pending",
    2: "active",
    3: "scheduled",
    4: "retry",
    5: "archived",
    6: "completed",
};

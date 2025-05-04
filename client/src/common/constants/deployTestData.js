export const simpleDeploy = {
    name: "user-service",
    environment: "dev",
    components: [
        {
            name: "user",
            image: { repository: "rishabh75/sample-node", tag: "latest" },
            replica_count: 1,
            service_port: 9069,
            resources: {
                requests: { cpu: "1", memory: "500Mi" },
                limits: { cpu: "1", memory: "500Mi" },
            },
            env: [
                { key: "MODE", value: "server" },
                { key: "SERVER_TYPE", value: "USER" },
            ],
        },
    ],
    ingress: {
        host: "orbitdeck.app",
    },
};

export const multiDeploy = {
    name: "main",
    environment: "dev",
    components: [
        {
            name: "internal-postgres",
            image: { repository: "postgres:14.10-alpine3.19", tag: "latest" },
            replica_count: 1,
            service_port: 5432,
            resources: {
                requests: { cpu: "1", memory: "500Mi" },
                limits: { cpu: "1", memory: "500Mi" },
            },
            env: [
                { key: "POSTGRES_USER", value: "root" },
                { key: "POSTGRES_PASSWORD", value: "root" },
                { key: "POSTGRES_DB", value: "be-orbitdeck" },
            ],
        },
        {
            name: "user",
            image: { repository: "rishabh75/templateapp-user", tag: "latest" },
            replica_count: 1,
            service_port: 9069,
            resources: {
                requests: { cpu: "1", memory: "500Mi" },
                limits: { cpu: "1", memory: "500Mi" },
            },
            env: [
                { key: "MODE", value: "server" },
                { key: "SERVER_TYPE", value: "USER" },
            ],
        },
        {
            name: "client",
            image: {
                repository: "rishabh75/templateapp-client",
                tag: "latest",
            },
            replica_count: 1,
            service_port: 3000,
            resources: {
                requests: { cpu: "1", memory: "1000Mi" },
                limits: { cpu: "1", memory: "1000Mi" },
            },
            env: [
                {
                    key: "API_URL",
                    value: "https://test.orbitdeck.app/api/user",
                },
                { key: "ENV", value: "development" },
                { key: "PORT", value: "3000" },
            ],
        },
    ],
    ingress: {
        host: "test.orbitdeck.app",
    },
};

export const multiIngressDeploy = {
    ...multiDeploy,
    ingress: [
        {
            host: "orbitdeck.app",
            path: "/api/user/?(.*)",
            serviceName: "user-svc",
            servicePort: 9069,
        },
    ],
};

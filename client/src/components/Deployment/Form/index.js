import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { ComponentForm } from "../../ComponentForm";
import { DeploymentService } from "../../../services/deployment.services";
import { skillIconUrls } from "../../../common/constants";
import FloatingIcons from "../../FloatingIcons";

const PageWrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    background: radial-gradient(circle at top, #1c1c1e 0%, #0e0e10 70%);
    color: ${({ theme }) => theme.colors.textPrimary};
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow-x: hidden;
    padding: 80px 20px;
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

const FormWrapper = styled.form`
    width: 100%;
    max-width: 1200px;
    position: relative;
    z-index: 2;
`;

const Title = styled.h1`
    font-size: 40px;
    text-align: center;
    margin-bottom: 40px;
    background: ${({ theme }) => theme.colors.gradientPrimary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    margin-bottom: 16px;
    border-radius: 8px;
    border: 1px solid #333;
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textPrimary};
`;

const AddButton = styled.button`
    background: transparent;
    border: 2px dashed ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    padding: 10px 20px;
    font-weight: 600;
    margin-top: 20px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
        border-color: transparent;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
    }
`;

const SubmitButton = styled.button`
    background: ${({ theme }) => theme.colors.gradientPrimary};
    padding: 10px 40px;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 18px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    margin-top: 40px;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background: ${({ theme }) => theme.colors.primaryHover};
        box-shadow: 0 0 20px ${({ theme }) => theme.colors.primaryHover};
        transform: translateY(-2px);
    }
`;

const repositories = [
    {
        label: "PostgreSQL",
        value: "postgres:latest",
        icon: skillIconUrls.postgresql,
    },
    { label: "MongoDB", value: "mongodb:latest", icon: skillIconUrls.mongodb },
    { label: "Redis", value: "redis:latest", icon: skillIconUrls.redis },
    { label: "MySQL", value: "mysql:latest", icon: skillIconUrls.mysql },
    { label: "Grafana", value: "grafana:latest", icon: skillIconUrls.grafana },
    { label: "Sentry", value: "sentry:latest", icon: skillIconUrls.sentry },
    {
        label: "RabbitMQ",
        value: "rabbitmq:latest",
        icon: skillIconUrls.rabbitmq,
    },
    { label: "Custom", value: "custom", icon: "" },
];

const DeployPage = () => {
    const { control, register, handleSubmit, setValue } = useForm({
        defaultValues: {
            name: "",
            environment: "",
            components: [],
            ingress: {
                host: "",
                path: "",
                serviceName: "",
                servicePort: 0,
            },
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "components",
    });

    const [selectedRepo, setSelectedRepo] = useState([]);
    const history = useHistory();

    const onSubmit = async (data) => {
        try {
            await DeploymentService.createDeployment(data);
            alert("Deployment created successfully!");
            history.push("/dashboard");
        } catch (error) {
            console.error(error.response?.data || error.message);
            alert(error.response?.data?.error || "Deployment failed");
        }
    };

    return (
        <>
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                <FloatingIcons />
            </div>

            <PageWrapper>
                {/* Background Blobs */}
                <BackgroundBlob style={{ top: "150px", left: "10%" }} />
                <BackgroundBlob style={{ top: "600px", right: "15%" }} />

                <Title>Deploy a New App</Title>

                <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                    <div style={{ marginBottom: "30px" }}>
                        <Label>App Name</Label>
                        <Input
                            {...register("name", { required: true })}
                            placeholder="e.g., orbitdeck-api"
                        />

                        <Label>Environment</Label>
                        <Input
                            {...register("environment", { required: true })}
                            placeholder="production / dev"
                        />
                    </div>

                    {fields.map((field, idx) => (
                        <ComponentForm
                            key={field.id}
                            idx={idx}
                            control={control}
                            register={register}
                            setValue={setValue}
                            repositories={repositories}
                            selectedRepo={selectedRepo}
                            setSelectedRepo={setSelectedRepo}
                            remove={remove}
                        />
                    ))}

                    <AddButton
                        type="button"
                        onClick={() => {
                            append({
                                name: "",
                                image: { repository: "", tag: "" },
                                replica_count: 1,
                                service_port: 80,
                                resources: {
                                    requests: { cpu: "100m", memory: "128Mi" },
                                    limits: { cpu: "500m", memory: "512Mi" },
                                },
                                env: [],
                            });
                            setSelectedRepo((prev) => [...prev, {}]);
                        }}
                    >
                        + Add Another Component
                    </AddButton>

                    <br />
                    <SubmitButton type="submit">🚀 Deploy Now</SubmitButton>
                </FormWrapper>
            </PageWrapper>
        </>
    );
};

export default DeployPage;

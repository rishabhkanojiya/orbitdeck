import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { ComponentForm } from "../../ComponentForm";
import { DeploymentService } from "../../../services/deployment.services";
import { skillIconUrls } from "../../../common/constants";
import FloatingIcons from "../../FloatingIcons";

import { useTestDeployData } from "../../../hooks/useTestDeployData";
import { Consume } from "../../../context/Consumer";
import { ShowPopupContext } from "../../../context";

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

const TestButton = styled.button`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin-left: 10px;
    padding: 10px 20px;
    font-weight: 700;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    margin-bottom: 24px;
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
        background: ${({ theme }) => theme.colors.primaryHover};
        box-shadow: 0 0 10px ${({ theme }) => theme.colors.primaryHover};
    }
`;

const repositories = [
    {
        label: "PostgreSQL",
        value: "postgres",
        icon: skillIconUrls.postgres,
    },
    { label: "MongoDB", value: "mongodb", icon: skillIconUrls.mongodb },
    { label: "Redis", value: "redis", icon: skillIconUrls.redis },
    { label: "MySQL", value: "mysql", icon: skillIconUrls.mysql },
    { label: "Grafana", value: "grafana", icon: skillIconUrls.grafana },
    { label: "Sentry", value: "sentry", icon: skillIconUrls.sentry },
    {
        label: "RabbitMQ",
        value: "rabbitmq",
        icon: skillIconUrls.rabbitmq,
    },
    { label: "Custom", value: "custom", icon: "" },
];

const DeploymentForm = ({ ShowPopupData }) => {
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
            const deployment = await DeploymentService.createDeployment(data);

            ShowPopupData.setPopupMessageObj(
                { message: "Deployment currently in progress" },
                "success",
            );

            const id = deployment?.data?.id;
            if (id) {
                history.push(`/deployment/${id}`);
            } else {
                history.push("/dashboard");
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
            ShowPopupData.setPopupMessageObj(
                error.response?.data?.error || "Deployment failed",
                "error",
            );
        }
    };

    const { fillSimpleDeploy, fillMultiDeploy, fillMultiIngressDeploy } =
        useTestDeployData(setValue, append, setSelectedRepo);

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
                    <TestButton type="button" onClick={fillSimpleDeploy}>
                        ⚡ Fill Dummy Data
                    </TestButton>
                    <TestButton onClick={fillMultiDeploy}>
                        ⚡ Fill Multi Deploy
                    </TestButton>
                </FormWrapper>
            </PageWrapper>
        </>
    );
};

export default Consume(DeploymentForm, [ShowPopupContext]);

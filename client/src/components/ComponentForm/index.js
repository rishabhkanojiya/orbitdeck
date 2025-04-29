import React from "react";
import styled from "styled-components";
import { CustomDropdown } from "../CustomDropdown";
import { PrimaryButton } from "../Button";

const Section = styled.div`
    margin-bottom: 32px;
    background: rgba(28, 28, 30, 0.6);
    padding: 24px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Label = styled.label`
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 16px;
    border-radius: 8px;
    border: 1px solid #333;
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textPrimary};
`;

const TwoColumn = styled.div`
    display: flex;
    gap: 16px;
`;

const Column = styled.div`
    flex: 1;
`;

export const ComponentForm = ({
    register,
    setValue,
    idx,
    repositories,
    selectedRepo,
    setSelectedRepo,
    remove,
}) => {
    return (
        <Section>
            <h3>Component {idx + 1}</h3>

            <TwoColumn>
                <Column>
                    <Label>Component Name</Label>
                    <Input
                        {...register(`components.${idx}.name`, {
                            required: true,
                        })}
                        placeholder="e.g., backend-api"
                    />
                </Column>
                <Column>
                    <Label>Repository</Label>
                    <CustomDropdown
                        options={repositories}
                        selected={selectedRepo[idx]}
                        onSelect={(option) => {
                            setSelectedRepo((prev) => {
                                const updated = [...prev];
                                updated[idx] = option;
                                return updated;
                            });
                            if (option.value === "custom") {
                                setValue(
                                    `components.${idx}.image.repository`,
                                    "",
                                );
                            } else {
                                setValue(
                                    `components.${idx}.image.repository`,
                                    option.value,
                                );
                            }
                        }}
                    />
                </Column>
            </TwoColumn>

            {selectedRepo[idx]?.value === "custom" && (
                <Input
                    {...register(`components.${idx}.image.repository`, {
                        required: true,
                    })}
                    placeholder="Custom Repo URL"
                />
            )}

            <TwoColumn>
                <Column>
                    <Label>Tag</Label>
                    <Input
                        {...register(`components.${idx}.image.tag`, {
                            required: true,
                        })}
                        placeholder="latest"
                    />
                </Column>
                <Column>
                    <Label>Replica Count</Label>
                    <Input
                        type="number"
                        {...register(`components.${idx}.replica_count`, {
                            required: true,
                        })}
                        placeholder="1"
                    />
                </Column>
            </TwoColumn>

            <TwoColumn>
                <Column>
                    <Label>Service Port</Label>
                    <Input
                        type="number"
                        {...register(`components.${idx}.service_port`, {
                            required: true,
                        })}
                        placeholder="80"
                    />
                </Column>
                <Column>
                    <Label>CPU Request</Label>
                    <Input
                        {...register(
                            `components.${idx}.resources.requests.cpu`,
                        )}
                        placeholder="100m"
                    />
                </Column>
            </TwoColumn>

            <TwoColumn>
                <Column>
                    <Label>Memory Request</Label>
                    <Input
                        {...register(
                            `components.${idx}.resources.requests.memory`,
                        )}
                        placeholder="128Mi"
                    />
                </Column>
                <Column>
                    <Label>CPU Limit</Label>
                    <Input
                        {...register(`components.${idx}.resources.limits.cpu`)}
                        placeholder="500m"
                    />
                </Column>
            </TwoColumn>

            <PrimaryButton type="button" onClick={() => remove(idx)}>
                Remove Component
            </PrimaryButton>
        </Section>
    );
};

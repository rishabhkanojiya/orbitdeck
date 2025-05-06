import React from "react";
import styled from "styled-components";
import { CustomDropdown } from "../CustomDropdown";
import { PrimaryButton } from "../Button";
import { useFieldArray } from "react-hook-form";

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
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        background-color: ${({ theme }) => theme.colors.surface};
        color: ${({ theme }) => theme.colors.textPrimary};
        border-color: ${({ theme }) => theme.colors.primary};
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
        box-shadow: 0 0 0px 1000px ${({ theme }) => theme.colors.surface} inset !important;
        -webkit-text-fill-color: ${({ theme }) =>
            theme.colors.textPrimary} !important;
        transition: background-color 5000s ease-in-out 0s;
    }
`;

const TwoColumn = styled.div`
    display: flex;
    gap: 16px;
`;

const Column = styled.div`
    flex: 1;
`;

const AddButton = styled.button`
    background: transparent;
    border: 2px dashed ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    padding: 10px 20px;
    font-weight: 600;
    margin-top: 20px;
    margin-bottom: 10px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
        border-color: transparent;
        box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary};
    }
`;

const ThreeColumn = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
`;

export const ComponentForm = ({
    register,
    setValue,
    idx,
    control,
    repositories,
    selectedRepo,
    setSelectedRepo,
    remove,
}) => {
    const {
        fields: envFields,
        append: appendEnv,
        remove: removeEnv,
    } = useFieldArray({
        control,
        name: `components.${idx}.env`,
    });

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

            <h4>Environment Variables</h4>
            {envFields.map((envField, envIdx) => (
                <ThreeColumn key={envField.id}>
                    <Column>
                        <Label>Key</Label>
                        <Input
                            {...register(
                                `components.${idx}.env.${envIdx}.key`,
                                { required: true },
                            )}
                            placeholder="e.g., DB_HOST"
                        />
                    </Column>
                    <Column>
                        <Label>Value</Label>
                        <Input
                            {...register(
                                `components.${idx}.env.${envIdx}.value`,
                                { required: true },
                            )}
                            placeholder="e.g., localhost"
                        />
                    </Column>
                    <AddButton
                        style={{ height: "40px" }}
                        type="button"
                        onClick={() => removeEnv(envIdx)}
                    >
                        Remove
                    </AddButton>
                </ThreeColumn>
            ))}

            <AddButton
                type="button"
                onClick={() => appendEnv({ key: "", value: "" })}
            >
                + Add Env Var
            </AddButton>

            <PrimaryButton type="button" onClick={() => remove(idx)}>
                Remove Component
            </PrimaryButton>
        </Section>
    );
};

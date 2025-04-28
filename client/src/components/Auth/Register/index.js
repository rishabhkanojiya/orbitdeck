import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { Consume } from "../../../context/Consumer";
import { LoginContext, ShowPopupContext } from "../../../context";
import { useForm } from "react-hook-form";
import { AuthService } from "../../../services/auth.services";
import { PrimaryButton } from "../../Button";

const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const FormContainer = styled.div`
    width: 100%;
    max-width: 400px;
    background-color: ${({ theme }) => theme.colors.surface};
    padding: 32px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h2`
    font-size: 28px;
    text-align: center;
    margin-bottom: 24px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 16px;
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 16px;

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.primary};
    }
`;

const Text = styled.p`
    margin-top: 16px;
    font-size: 14px;
    text-align: center;
    color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledLink = styled(Link)`
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: underline;
`;

const Register = ({ ShowPopupData, LoginData }) => {
    const history = useHistory();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        clearErrors,
    } = useForm({ mode: "onSubmit" });

    const onSubmit = (data) => {
        AuthService.register(data)
            .then((result) => {
                LoginData.setUserObj(result);
                history.push("/login");
            })
            .catch((err) => {
                ShowPopupData.setPopupMessageObj(err.response.data, "error");
            });
    };

    const passwordMatchValidation = {
        required: true,
        validate: {
            passwordMatch: (value) => value === getValues().password,
        },
    };

    useEffect(() => {
        if (errors?.confirmPassword?.type === "passwordMatch") {
            ShowPopupData.setPopupMessageObj(
                { message: "Passwords do not match" },
                "error",
            );
            clearErrors("confirmPassword");
        }
    }, [errors?.confirmPassword?.type]);

    return (
        <Wrapper>
            <FormContainer>
                <Title>Register</Title>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        id="firstName"
                        placeholder="First Name"
                        required
                        {...register("firstName")}
                    />
                    <Input
                        id="lastName"
                        placeholder="Last Name"
                        required
                        {...register("lastName")}
                    />
                    <Input
                        id="email"
                        type="email"
                        placeholder="Email"
                        required
                        {...register("email")}
                    />
                    <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        required
                        {...register("password")}
                    />
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        required
                        {...register(
                            "confirmPassword",
                            passwordMatchValidation,
                        )}
                    />
                    <PrimaryButton type="submit">Register</PrimaryButton>
                </Form>
                <Text>
                    Already have an account?{" "}
                    <StyledLink to="/auth/login">Login</StyledLink>
                </Text>
            </FormContainer>
        </Wrapper>
    );
};

export default Consume(Register, [ShowPopupContext, LoginContext]);

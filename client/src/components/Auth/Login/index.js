import React from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { AuthService } from "../../../services/auth.services";
import { LoginContext, ShowPopupContext } from "../../../context";
import { Consume } from "../../../context/Consumer";
import { useForm } from "react-hook-form";
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

const Login = ({ ShowPopupData, LoginData }) => {
    const { register, handleSubmit } = useForm();
    const history = useHistory();

    const onSubmit = async (data) => {
        try {
            const result = await AuthService.login(data);
            LoginData.setUserObj(result.data.user);
            history.push("/");
        } catch (err) {
            ShowPopupData.setPopupMessageObj(err.response.data, "error");
        }
    };

    return (
        <Wrapper>
            <FormContainer>
                <Title>Login</Title>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Input
                        id="username"
                        placeholder="Username"
                        required
                        value={"rk1"}
                        {...register("username")}
                    />
                    <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        required
                        value={"Qwe@123456"}
                        {...register("password")}
                    />
                    <PrimaryButton type="submit">Login</PrimaryButton>
                </Form>
                <Text>
                    Don't have an account?{" "}
                    <StyledLink to="/auth/register">Register</StyledLink>
                </Text>
            </FormContainer>
        </Wrapper>
    );
};

export default Consume(Login, [ShowPopupContext, LoginContext]);

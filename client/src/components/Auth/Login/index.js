import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Typography, TextField, Button } from "@mui/material";
import { styled } from "styled-components";
import { AuthService } from "../../../services/auth.services";
import { LoginContext, ShowPopupContext } from "../../../context";
import { Consume } from "../../../context/Consumer";
import { useForm } from "react-hook-form";
import { routesObj } from "../../../common/constants";

const Wrapper = styled.div`
    height: 100%;
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const StyledLink = styled(Link)`
    color: #ce93d8;
`;

const Login = ({ ShowPopupData, LoginData }) => {
    const { register, handleSubmit } = useForm();
    const history = useHistory();

    const onSubmit = async (data) => {
        try {
            const result = await AuthService.login(data);
            LoginData.setUserObj(result.data.user);
            console.log(result.data.user);

            history.push(routesObj.home);
        } catch (err) {
            ShowPopupData.setPopupMessageObj(err.response.data, "error");
        }
    };

    return (
        <Wrapper>
            <Container maxWidth="sm">
                <Typography variant="h4" align="center" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        id="username"
                        label="Username"
                        fullWidth
                        margin="normal"
                        value="rk1"
                        required
                        {...register("username")}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value="Qwe@123456"
                        required
                        {...register("password")}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        fullWidth
                    >
                        Login
                    </Button>
                    <Typography mt={2} variant="body2" align="center">
                        Don't have an account?{" "}
                        <StyledLink to="/auth/register">Register</StyledLink>
                    </Typography>
                    <Typography variant="body2" align="center">
                        <StyledLink to="/auth/forgot-password">
                            Forgot password?
                        </StyledLink>
                    </Typography>
                </form>
            </Container>
        </Wrapper>
    );
};

export default Consume(Login, [ShowPopupContext, LoginContext]);

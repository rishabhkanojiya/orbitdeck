import React, { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Container, Typography, TextField, Button } from "@mui/material";
import { styled } from "styled-components";
import { Consume } from "../../../context/Consumer";
import { LoginContext, ShowPopupContext } from "../../../context";
import { useForm } from "react-hook-form";
import { AuthService } from "../../../services/auth.services";

const Wrapper = styled.div`
    height: 100%;
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const Register = ({ ShowPopupData, LoginData }) => {
    const history = useHistory();
    const { token } = useParams();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
        clearErrors,
    } = useForm({ mode: "onSubmit" });

    const onSubmit = (data) => {
        AuthService.resetPassword({ ...data, token })
            .then((result) => {
                LoginData.setUserObj(result);
                history.push("/login");
            })
            .catch((err) => {
                ShowPopupData.setPopupMessageObj(err.response.data, "error");
            });
    };

    let passwordMatchValidation = {
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
            <Container maxWidth="sm">
                <Typography variant="h4" align="center" gutterBottom>
                    Reset Password
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        {...register("password")}
                    />
                    <TextField
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        {...register(
                            "confirmPassword",
                            passwordMatchValidation,
                        )}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        fullWidth
                    >
                        CHANGE PASSWORD
                    </Button>
                </form>
            </Container>
        </Wrapper>
    );
};

export default Consume(Register, [ShowPopupContext, LoginContext]);

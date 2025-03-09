import React from "react";
import { Container, Typography, Box } from "@mui/material";
import { styled } from "styled-components";
import { Consume } from "../../context/Consumer";
import { LoginContext } from "../../context";

const Wrapper = styled.div`
    height: 100%;
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
`;

const User = ({ LoginData }) => {
    const user = { ...LoginData.data };

    return (
        <Wrapper>
            <Container maxWidth="sm">
                <Typography variant="h4" align="center" gutterBottom>
                    User Page
                </Typography>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography variant="h6">
                        First Name: <span>{user.firstName}</span>
                    </Typography>
                    <Typography variant="h6">
                        Last Name: <span>{user.lastName}</span>
                    </Typography>
                    <Typography variant="h6">
                        <span>{user.email}</span>
                    </Typography>
                </Box>
            </Container>
        </Wrapper>
    );
};

export default Consume(User, [LoginContext]);

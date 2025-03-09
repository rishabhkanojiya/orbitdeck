import { Box, CircularProgress } from "@mui/material";
import React from "react";

const Loader = () => {
    return (
        <Box
            sx={{
                display: "flex",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <CircularProgress color="secondary" />
        </Box>
    );
};

export default Loader;

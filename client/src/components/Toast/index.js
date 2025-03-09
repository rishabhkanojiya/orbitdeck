import { Alert, Snackbar } from "@mui/material";
import React, { useEffect } from "react";
import { ShowPopupContext } from "../../context";
import { Consume } from "../../context/Consumer";

const Toast = ({ ShowPopupData }) => {
    const { showPopup, data, setShowPopup } = ShowPopupData;
    const { state, msg } = data;

    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={showPopup}
            autoHideDuration={5000}
            onClose={() => setShowPopup(false)}
        >
            <Alert
                onClose={() => setShowPopup(false)}
                severity={state}
                sx={{ width: "100%" }}
            >
                {msg}
            </Alert>
        </Snackbar>
    );
};

export default Consume(Toast, [ShowPopupContext]);

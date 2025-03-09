import { AppBar, Dialog, IconButton, Toolbar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

export const useDialog = () => {
    const [isVisible, setIsVisible] = useState(false);
    const show = () => setIsVisible(true);
    const hide = () => setIsVisible(false);

    const RenderDialog = ({ children, heading }) => (
        <>
            {isVisible && (
                <Dialog fullScreen open={isVisible} onClose={hide}>
                    <AppBar sx={{ position: "relative" }}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={hide}
                                aria-label="close"
                            >
                                <CloseIcon />
                            </IconButton>
                            <Typography
                                sx={{ ml: 2, flex: 1 }}
                                variant="h6"
                                component="div"
                            >
                                {heading}
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    {children}
                </Dialog>
            )}
        </>
    );

    return {
        show,
        hide,
        RenderDialog,
        isVisible,
    };
};

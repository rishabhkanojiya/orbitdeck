import {
    AppBar,
    Button,
    Dialog,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { Consume } from "../../context/Consumer";
import { DialogContext } from "../../context";

const DialogComp = ({ DialogData }) => {
    const { showDialog, setShowDialog } = DialogData;
    console.log(showDialog);

    const handleClose = () => setShowDialog(false);

    return (
        <Dialog fullScreen open={showDialog} onClose={handleClose}>
            <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography
                        sx={{ ml: 2, flex: 1 }}
                        variant="h6"
                        component="div"
                    >
                        {/* Sound */}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Dialog>
    );
};

export default Consume(DialogComp, [DialogContext]);

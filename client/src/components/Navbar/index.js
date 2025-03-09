import { Add, Menu, MoreVert } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import * as React from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { LoginContext } from "../../context";
import { Consume } from "../../context/Consumer";
import FabComp from "../FabComp";
import Drawer from "./Drawer";

function BottomAppBar({ fwdRef }) {
    let { path } = useRouteMatch();
    const history = useHistory();

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let drawerProps = { open, handleClose, handleOpen };

    const renderAddButton = () => {
        const renderVal = ["/members", "/"].includes(path);
        const toPath = path == "/" ? "/groups" : "/members";

        const pulseValue = path == "/";

        let fabProps = {
            Icon: Add,
            pulseValue,
            handler: () => history.push(`${toPath}/add`),
        };

        return renderVal && <FabComp {...fabProps} />;
    };
    return (
        <>
            <AppBar
                position="fixed"
                color="primary"
                sx={{ top: "auto", bottom: 0 }}
            >
                <Toolbar ref={fwdRef}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleOpen}
                    >
                        <Menu />
                    </IconButton>
                    {renderAddButton()}
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton color="inherit">
                        <MoreVert />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer {...drawerProps} />
        </>
    );
}

export default Consume(BottomAppBar, [LoginContext]);

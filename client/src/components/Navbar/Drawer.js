import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import { Consume } from "../../context/Consumer";
import { LoginContext } from "../../context";
import { AuthService } from "../../services/auth.services";
import { routesObj } from "../../common/constants";

const StyledLink = styled(Link)`
    color: white;
`;

const Drawer = ({ open, handleClose, handleOpen, LoginData }) => {
    const history = useHistory();
    const links = [
        { text: "Groups", link: "/" },
        { text: "Members", link: "/members" },
    ];
    const userlinks = [{ text: "Settings", link: routesObj.me }];
    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={handleClose}
            onKeyDown={handleClose}
        >
            <List>
                {links.map(({ text, link }, index) => {
                    return (
                        <StyledLink key={text} to={link}>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        </StyledLink>
                    );
                })}
            </List>
            <Divider />
            <List>
                {userlinks.map(({ text, link }, index) => (
                    <StyledLink key={text} to={link}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    </StyledLink>
                ))}

                <ListItem
                    disablePadding
                    onClick={() => {
                        AuthService.logout()
                            .then((result) => {
                                LoginData.delUserObj();
                                history.push("/auth/login");
                            })
                            .catch((err) => {});
                    }}
                >
                    <ListItemButton>
                        <ListItemText primary={"Log Out"} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <SwipeableDrawer
            anchor="left"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
        >
            {list()}
        </SwipeableDrawer>
    );
};

export default Consume(Drawer, [LoginContext]);

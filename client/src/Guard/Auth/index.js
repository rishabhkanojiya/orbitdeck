import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Route, useHistory } from "react-router-dom";
import Loader from "../../components/Loader";
import Navbar from "../../components/Navbar";
import { LoginContext, ShowPopupContext } from "../../context";
import { Consume } from "../../context/Consumer";
import { UserService } from "../../services/user.services";

const AuthGuard = ({
    ShowPopupData,
    LoginData,
    component: Component,
    isAuthPage,
    requiresAuth,
    ...rest
}) => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(true);
    const navHeightref = useRef();

    const fetchUser = async () => {
        try {
            const userRes = await UserService.getUser();
            await LoginData.setUserObj(userRes.data.user);
        } catch (err) {
            if (requiresAuth) {
                history.push("/auth/login");
                ShowPopupData.setPopupMessageObj(err.response.data, "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const isLoggedIn = !!LoginData?.data?.username;

        if (rest?.bgFetch || (requiresAuth && !isLoggedIn)) {
            fetchUser();
        } else if (isAuthPage && isLoggedIn) {
            history.push("/");
        } else {
            setIsLoading(false);
        }
    }, [requiresAuth, isAuthPage, LoginData?.data?.username]);

    if (isLoading) return <Loader />;

    return (
        <Route
            {...rest}
            render={(props) =>
                LoginData?.data?.username ? (
                    <>
                        {/* <Navbar fwdRef={navHeightref} /> */}
                        <Box sx={{ paddingBottom: `56px` }}>
                            <Component {...props} />
                        </Box>
                    </>
                ) : (
                    <Component {...props} />
                )
            }
        />
    );
};

export default Consume(AuthGuard, [ShowPopupContext, LoginContext]);

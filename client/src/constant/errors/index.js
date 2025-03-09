const data = {
    loginErrors: {
        username: "Username Does Not Exist.",
        password: "Password does not match | Incorrect Password",
        username1: "Username Does Not exist from error.",
    },

    registerErrors: {
        23505: "Username or Email already exist.",
        // username1: "Username Does Not exist from error",
    },

    workOutError: {
        datatype: "",
    },
};

const defaultError = "somethingWentWrong";

export const apiError = (sKey, errorCodeP) => {
    let errorMessage = data[sKey] ? data[sKey][errorCodeP] : null;
    if (!errorMessage) {
        errorMessage = defaultError;
    }
    return errorMessage;
};

export const apiErrorAPi = (res) => {
    let errorMessage = res.message;
    if (!errorMessage) {
        errorMessage = defaultError;
    }
    return errorMessage;
};

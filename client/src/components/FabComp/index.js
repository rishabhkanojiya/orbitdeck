import React from "react";
import { Fab } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import { useHistory } from "react-router-dom";

const pulseAnimation = keyframes`
	0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 #ce93d8;
	}

	70% {
		transform: scale(1);
		box-shadow: 0 0 0 20px rgba(0, 0, 0, 0);
	}

	100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}
  
`;

const StyledFab = styled(Fab)(({ shouldPulse }) => ({
    position: "absolute",
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto",
    animation: !shouldPulse ? `${pulseAnimation} 2s infinite;` : "none",
}));

const FabComp = ({ Icon, pulseValue, handler }) => {
    return (
        <StyledFab
            color="secondary"
            aria-label="add"
            data-testid="add-btn"
            shouldPulse={pulseValue}
            onClick={handler}
        >
            <Icon />
        </StyledFab>
    );
};

export default FabComp;

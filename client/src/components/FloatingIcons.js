import React from "react";
import styled, { keyframes } from "styled-components";
import { tech } from "../common/constants";
import { getSkillIcons } from "../common/utils";

export const generateRandomPos = () => {
    const top = `${Math.floor(Math.random() * 90)}vh`;

    const leftOrRight = Math.random() > 0.5 ? "left" : "right";

    let leftRightValue;
    const edge = Math.random();
    if (edge < 0.5) {
        leftRightValue = `${Math.floor(Math.random() * 30)}%`;
    } else {
        leftRightValue = `${70 + Math.floor(Math.random() * 25)}%`;
    }

    const translateXStart = 0;
    const translateYStart = 0;
    const translateXEnd = `${Math.floor(Math.random() * 60) - 30}`;
    const translateYEnd = `${Math.floor(Math.random() * 60) - 30}`;

    return {
        style: {
            top,
            [leftOrRight]: leftRightValue,
        },
        animation: {
            translateXStart,
            translateYStart,
            translateXEnd,
            translateYEnd,
        },
    };
};

const float = (animation) => keyframes`
  0% {
    transform: translateY(${animation?.translateYStart || "0"}px) translateX(${
    animation?.translateXStart || "0"
}px);
  }
  100% {
    transform: translateY(${animation?.translateYEnd || "-20"}px) translateX(${
    animation?.translateXEnd || "10"
}px);
  }
`;

const FloatingAsset = styled.img`
    position: absolute;
    width: 80px;
    opacity: 0.4;
    filter: drop-shadow(0 0 6px ${({ theme }) => theme.colors.primary});

    animation: fadeIn 2s ease-in-out forwards,
        ${({ $animation }) => float($animation)} 6s ease-in-out infinite
            alternate;
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 0.4;
            transform: scale(1);
        }
    }
`;

const pickRandomSkills = (count) => {
    return [...tech].sort(() => 0.5 - Math.random()).slice(0, count);
};

const FloatingIcons = () => {
    const randomSkills = pickRandomSkills(6);

    return (
        <>
            {randomSkills.map((skill, idx) => {
                const asset = generateRandomPos();
                return (
                    <FloatingAsset
                        key={idx}
                        src={getSkillIcons(skill)}
                        style={asset.style}
                        $animation={asset.animation}
                        alt={skill}
                    />
                );
            })}
        </>
    );
};

export default FloatingIcons;

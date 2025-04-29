import React, { useState } from "react";
import styled from "styled-components";

const DropdownWrapper = styled.div`
    position: relative;
    margin-bottom: 16px;
`;

const Selected = styled.div`
    padding: 10px;
    border: 1px solid #333;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textPrimary};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Options = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${({ theme }) => theme.colors.surface};
    border: 1px solid #333;
    border-radius: 8px;
    margin-top: 4px;
    z-index: 10;
`;

const Option = styled.div`
    padding: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
        background-color: ${({ theme }) => theme.colors.primaryHover};
    }
`;

const Icon = styled.img`
    width: 24px;
    height: 24px;
    margin-right: 10px;
`;

export const CustomDropdown = ({ options, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <DropdownWrapper>
            <Selected onClick={() => setIsOpen(!isOpen)}>
                {selected?.icon && <Icon src={selected.icon} alt="" />}
                {selected?.label || "Select..."}
            </Selected>
            {isOpen && (
                <Options>
                    {options.map((option) => (
                        <Option
                            key={option.value}
                            onClick={() => handleSelect(option)}
                        >
                            {option.icon && <Icon src={option.icon} alt="" />}
                            {option.label}
                        </Option>
                    ))}
                </Options>
            )}
        </DropdownWrapper>
    );
};

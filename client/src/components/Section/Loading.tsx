import React from "react";
import classNames from "classnames";
import styled, { keyframes } from "styled-components";

export default function Loading() {
    return (
        <div>
            <Circle animationDelay={-0.32} />
            <Circle animationDelay={-0.16} />
            <Circle />
        </div>
    );
}

interface CircleProps {
    animationDelay?: number;
    className?: string;
}

function Circle({ animationDelay = 0, className }: CircleProps) {
    return (
        <StyledCircle
            animationDelay={animationDelay}
            className={classNames(
                "inline-block rounded-full w-2 h-2 ml-2 bg-blue-500",
                className
            )}
        />
    );
}

const pulse = keyframes`
    0%,
    80%,
    100% {
        opacity: 0;
    }

    40% {
        opacity: 1;
    }
`;

const StyledCircle = styled.div<{ animationDelay: number }>`
    animation: ${pulse} 1.4s infinite ease-in-out both;
    animation-delay: ${props => props.animationDelay}s;
`;

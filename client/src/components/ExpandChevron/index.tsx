import React from "react";
import classNames from "classnames";
import { ReactComponent as Chevron } from "components/Chevron.svg";
import styles from "./styles.module.css";

interface Props {
    isOpen: boolean;
    className?: string;
}

export default function ExpandChevron(props: Props) {
    return (
        <Chevron
            className={classNames(
                styles.chevron,
                props.isOpen && styles.closeChevron,
                props.className
            )}
        />
    );
}

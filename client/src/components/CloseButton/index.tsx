import React from "react";
import { ReactComponent as Chevron } from "components/Chevron.svg";
import styles from "./styles.module.css";

interface Props {
    onClose(): void;
}

export default function CloseButton(props: Props) {
    return (
        <button onClick={props.onClose} className={styles.closeButton}>
            <Chevron className={styles.buttonChevron} />
        </button>
    );
}

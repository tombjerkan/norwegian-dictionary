import React from "react";
import NavigationButton from "components/NavigationButton";
import { ReactComponent as Magnifier } from "components/Magnifier.svg";
import { ReactComponent as Chevron } from "components/RightChevron.svg";
import styles from "./styles.module.css";

export default function SearchNavigationButton() {
	return (
		<NavigationButton to="/" className={styles.container}>
			<Chevron className={styles.chevron} />
			<Magnifier className={styles.magnifier} />
		</NavigationButton>
	);
}

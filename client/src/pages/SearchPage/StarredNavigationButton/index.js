import React from "react";
import NavigationButton from "components/NavigationButton";
import { ReactComponent as Star } from "components/Star.svg";
import { ReactComponent as Chevron } from "components/RightChevron.svg";
import styles from "./styles.module.css";

export default function StarredNavigationButton() {
	return (
		<NavigationButton to="/starred" className={styles.container}>
			<Star className={styles.star} />
			<Chevron className={styles.chevron} />
		</NavigationButton>
	);
}

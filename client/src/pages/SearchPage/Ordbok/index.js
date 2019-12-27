import React from "react";
import Text from "components/Text";
import { ExpandableSection } from "../Section";
import { Header, SubHeader } from "../Header";
import styles from "./styles.module.css";

export default function Ordbok({ data, isLoading, error }) {
    return (
        <ExpandableSection title="Ordbok" isLoading={isLoading} error={error}>
            {data && data.map(entry => (
            	<div className={styles.entry}>
	            	<Header>{entry.term}</Header>
	            	<p className={styles.etymology}><Text text={entry.etymology} /></p>

	            	<ol className={styles.senses}>
		            	{entry.senses.map(sense => (
		            		<li>
		            			<SubHeader><Text text={sense.definition} /></SubHeader>
		            			<p className={styles.examples}><Text text={sense.examples} /></p>

		            			{sense.subDefinitions.map(subDefinition => (
		            				<div className={styles.subDefinition}>
		            					<div className={styles.subDefinitionDefinition}><Text text={subDefinition.definition} /></div>
		            					<div className={styles.subDefinitionExamples}><Text text={subDefinition.examples} /></div>
		            				</div>
		            			))}

		            			{sense.subEntries.map(subEntry => (
		            				<div className={styles.subEntry}>
		            					<span className={styles.subEntryTerm}><Text text={subEntry.term} /></span>{" "}
		            					<span className={styles.subEntryDefinition}><Text text={subEntry.definition} /></span>
		            				</div>
		            			))}
		            		</li>
		            	))}
	            	</ol>
	            </div>
            ))}
        </ExpandableSection>
    );
}

import React, { Component } from 'react';
import styles from "./styles.module.css";
import Section from "./Section";

class Results extends Component {

    render() {
        return (
            <div className={styles.container}>
                <Section
                    name="ordbok"
                    title="Ordbok"
                    query={this.props.match.params.query}
                    render={data => (
                        <ul className={styles.entriesList}>
                            {data.map(entry => <Entry entry={entry} />)}
                        </ul>
                    )} />

                <Section
                    name="wiktionary"
                    title="Wiktionary"
                    query={this.props.match.params.query}
                    render={data => (
                        <div dangerouslySetInnerHTML={{ __html: data }} />
                    )} />

                <Section
                    name="googleTranslate"
                    title="Google Translate"
                    query={this.props.match.params.query}
                    render={data => (
                        <ul>
                            {data.map(translation => <li>{translation}</li>)}
                        </ul>
                    )} />
          </div>
        );
    }
}

function Entry({ entry }) {
    return (
        <li>
            <h3 className={styles.term}>{entry.term}</h3>

            <div className={styles.etymology}>{entry.etymology}</div>

            {entry.senses.length > 0 &&
                <ol className={styles.sensesList}>
                    {entry.senses.map(sense =>
                        <li>
                            <div className={styles.definition}>{sense.definition}</div>

                            <div className={styles.examples}>{sense.examples}</div>

                            {sense.subDefinition &&
                                <div className={styles.subDefinitionContainer}>
                                    <div className={styles.subDefinition}>{sense.subDefinition.definition}</div>
                                    <div className={styles.subDefinitionExamples}>{sense.subDefinition.examples}</div>
                                </div>
                            }

                            {sense.subEntries.length > 0 &&
                                <ul className={styles.subEntriesList}>
                                    {sense.subEntries.map(subEntry =>
                                        <li>
                                            <span className={styles.subEntryTerm}>{subEntry.term}</span>
                                            {" "}
                                            {subEntry.definition}
                                        </li>
                                    )}
                                </ul>}
                        </li>
                    )}
                </ol>
            }
        </li>
    )
}

export default Results;

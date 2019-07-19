import React, { Component } from 'react';
import styles from "./App.module.css";

class App extends Component {

    state = {
        response: null
    };

    async componentDidMount() {
        const response = await fetch("/api/for");
        const json = await response.json();
        this.setState({ response: json });
    }

    render() {
        return (
            <div className={styles.container}>
                {this.state.response !== null &&
                    <ul className={styles.entriesList}>
                        {this.state.response.map(entry => <Entry entry={entry} />)}
                    </ul>
                }
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

export default App;

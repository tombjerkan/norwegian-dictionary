import React, { Component } from 'react';
import styles from "./ResultPage.module.css";
import Loading from "./Loading";

class ResultPage extends Component {

    state = {
        response: null
    };

    async componentDidMount() {
        const response = await fetch(`/api/${this.props.match.params.query}`);
        const json = await response.json();
        this.setState({ response: json });
    }

    render() {
        return (
            <div className={styles.container}>
                {this.state.response !== null ? (
                    <React.Fragment>
                        <div className={styles.sourceSection}>
                            <h2>Ordbok</h2>
                            <ul className={styles.entriesList}>
                                {this.state.response.ordbok.map(entry => <Entry entry={entry} />)}
                            </ul>
                        </div>

                        <div className={styles.sourceSection}>
                            <h2>Wiktionary</h2>
                            <div dangerouslySetInnerHTML={{ __html: this.state.response.wiktionary }} />
                        </div>

                        <div className={styles.sourceSection}>
                            <h2>Google Translate</h2>
                            <ul>
                                {this.state.response.googleTranslate.map(translation => <li>{translation}</li>)}
                            </ul>
                        </div>
                    </React.Fragment>
                ) : (
                    <Loading />
                )}
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

export default ResultPage;

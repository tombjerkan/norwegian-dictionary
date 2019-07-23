import React, { Component } from 'react';
import styles from "./ResultPage.module.css";
import Loading from "./Loading";

class ResultPage extends Component {

    state = {
        ordbok: null,
        wiktionary: null,
        googleTranslate: null
    };

    async componentDidMount() {
        fetch(`/api/ordbok/${this.props.match.params.query}`).then(async response => {
            this.setState({ ordbok: await response.json() });
        });

        fetch(`/api/wiktionary/${this.props.match.params.query}`).then(async response => {
            this.setState({ wiktionary: await response.json() });
        });

        fetch(`/api/googleTranslate/${this.props.match.params.query}`).then(async response => {
            this.setState({ googleTranslate: await response.json() });
        });
    }

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.sourceSection}>
                    <h2>Ordbok</h2>

                    {this.state.ordbok !== null ? (
                        <ul className={styles.entriesList}>
                            {this.state.ordbok.map(entry => <Entry entry={entry} />)}
                        </ul>
                    ) : (
                        <Loading />
                    )}
                </div>


                <div className={styles.sourceSection}>
                    <h2>Wiktionary</h2>

                    {this.state.wiktionary !== null ? (
                        <div dangerouslySetInnerHTML={{ __html: this.state.wiktionary }} />
                    ) : (
                        <Loading />
                    )}
                </div>

                <div className={styles.sourceSection}>
                    <h2>Google Translate</h2>

                    {this.state.googleTranslate !== null ? (
                        <ul>
                            {this.state.googleTranslate.map(translation => <li>{translation}</li>)}
                        </ul>
                    ) : (
                        <Loading />
                    )}
                </div>
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

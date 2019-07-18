import React, { Component } from 'react';

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
          <div>
              {this.state.response !== null && this.state.response.map(entry => <Entry entry={entry} />)}
          </div>
        );
    }
}

function Entry({ entry }) {
    return (
        <div>
            <h1>{entry.term}</h1>

            <div>
                <h2>{entry.definition.header}</h2>

                {entry.definition.interpretations.length > 0 &&
                    <ol>
                        {entry.definition.interpretations.map(interpretation =>
                            <li>
                                <h3>{interpretation.header}</h3>

                                <div>{interpretation.examples}</div>

                                {interpretation.expanded &&
                                    <div>
                                        <div>{interpretation.expanded.header}</div>
                                        <div>{interpretation.expanded.examples}</div>
                                    </div>
                                }

                                {interpretation.articleContent.length > 0 &&
                                    <ul>
                                        {interpretation.articleContent.map(articleEntry =>
                                            <li>
                                                {articleEntry.header} {articleEntry.expanded}
                                            </li>
                                        )}
                                    </ul>}
                            </li>
                        )}
                    </ol>
                }
            </div>
        </div>
    )
}

export default App;

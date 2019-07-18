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
            <div>{entry.term}</div>

            <div>
                <div>{entry.etymology}</div>

                {entry.senses.length > 0 &&
                    <ol>
                        {entry.senses.map(sense =>
                            <li>
                                <div>{sense.definition}</div>

                                <div>{sense.examples}</div>

                                {sense.subDefinition &&
                                    <div>
                                        <div>{sense.subDefinition.definition}</div>
                                        <div>{sense.subDefinition.examples}</div>
                                    </div>
                                }

                                {sense.subEntries.length > 0 &&
                                    <ul>
                                        {sense.subEntries.map(subEntry =>
                                            <li>
                                                {subEntry.term} {subEntry.definition}
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

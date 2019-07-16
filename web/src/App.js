import React, { Component } from 'react';

class App extends Component {

    state = {
        word: null
    };

    async componentDidMount() {
        const response = await fetch("/api/for");
        const json = await response.json();
        this.setState({ word: json.word });
    }

    render() {
        return (
          <div>
              {this.state.word}
          </div>
        );
    }
}

export default App;

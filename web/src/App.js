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
              {this.state.response}
          </div>
        );
    }
}

export default App;

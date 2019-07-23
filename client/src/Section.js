import React, { Component } from "react";
import styles from "./Section.module.css";
import Loading from "./Loading";

class Section extends Component {

    state = {
        data: null
    };

    async componentDidMount() {
        const response = await fetch(`/api/${this.props.name}/${this.props.query}`);
        this.setState({ data: await response.json() });
    }

    render() {
        return (
            <div className={styles.container}>
                <h2>{this.props.title}</h2>
                {this.state.data !== null ? this.props.render(this.state.data) : <Loading />}
            </div>
        )
    }
}

export default Section;
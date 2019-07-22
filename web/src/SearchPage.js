import React, { Component } from "react";
import styles from "./SearchPage.module.css";

class SearchPage extends Component {

    state = {
        queryValue: ""
    };

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ queryValue: event.target.value });
    }

    handleSubmit(event) {
        this.props.history.push(`/${this.state.queryValue}`);
        event.preventDefault();
    }

    render() {
        return (
            <div className={styles.container}>
                <form onSubmit={this.handleSubmit} className={styles.form}>
                    <input type="text" onChange={this.handleChange} className={styles.queryInput} />
                    <input type="submit" value="Submit" className={styles.submitButton} />
                </form>
            </div>
        )
    }
}

export default SearchPage;
import React, { Component } from 'react';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        this.props.onLogin(this.state.value);
        event.preventDefault();
    }

    render() {
        let is_valid = false;
        let message = ""
        if (this.state.value.length > 0 && this.state.value.length < 6) {
            message = "Your username must be 6 or more characters."
        }
        if (this.state.value.length >= 6) {
            is_valid = true;
        }
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Username:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                {message}
            <input disabled={!is_valid} type="submit" value="Submit" />
            </form>
        );
    }
}


import React, { Component } from 'react';

const MIN_USERNAME = 5;
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
        console.log("Login");

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
        if (this.state.value.length > 0 && this.state.value.length < MIN_USERNAME) {
            message = `Your username must be ${MIN_USERNAME} or more characters.`
        }
        if (this.state.value.length >= MIN_USERNAME) {
            is_valid = true;
        }
        return (
            <form onSubmit={this.handleSubmit}>
                <h2>Login</h2>
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


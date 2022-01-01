import React, { Component } from 'react';
import HelpComponent from './Help';

import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import 'firebaseui/dist/firebaseui.css';

// var firebaseui = require('firebaseui');

const MIN_USERNAME = 5;
const STORAGE_TOKEN = 'existing-username';
export default class Login extends React.Component {
    constructor(props) {
        super(props);
        const username = localStorage.getItem(STORAGE_TOKEN) || '';
        this.state = {value: username};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.nameInput.focus();
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        ui.start('#firebaseui-auth-container', {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    console.log(authResult.additionalUserInfo.profile.email);
                    this.props.onLogin(authResult.additionalUserInfo.profile.email);
                    return false;
                }.bind(this),
                uiShown: function() {
                }
            },
            signInOptions: [
                { 
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                    requireDisplayName: true
                },
            ],
            // Other config options...
            signInFlow: 'popup',
          });
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        localStorage.setItem(STORAGE_TOKEN, this.state.value);
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
        return <div className="login">
            <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
                <h2>Login</h2>
                <label>
                    Screen name:
                    <input ref={(input) => { this.nameInput = input; }} type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                {message}
            <button disabled={!is_valid} type="submit" className="pure-button">Enter as Guest</button>
            </form>

            <h3>Sign in:</h3>
            <div id='firebaseui-auth-container' disabled={!is_valid}></div>

        </div>;
    }
}


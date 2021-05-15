import React, { Component } from 'react';
import Login from './Login';
import Game from './Game';
import Lobby from './Lobby';
import firebase from "firebase/app";
import "firebase/database";

const AppStates = [
  "CONNECTING",
  "LOGIN",
  "LOBBY",
  "GAME",
];

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      database: null,
      app_state: "LOGIN",
      game_id: null,
      username: null
    }
  }

  componentDidMount() {
    firebase.initializeApp({
      // apiKey: "API_KEY",
      // authDomain: "PROJECT_ID.firebaseapp.com",
      databaseURL: "https://sanctuary-7495f-default-rtdb.firebaseio.com/",
      projectId: "sanctuary-7495f",
      // storageBucket: "PROJECT_ID.appspot.com",
      // messagingSenderId: "SENDER_ID",
      // appId: "APP_ID",
      // measurementId: "G-MEASUREMENT_ID",
    });
    
    var database = firebase.database();
    
    database.ref('lobbies/a').set({
      users: 'username',
    });

    this.setState({
      database: database,
      app_state: "LOGIN",
    })
  }

  onLogin(username) {
    this.setState({
      app_state: "LOBBY",
      username: username
    });
  }

  onGameStarted(game_uuid) {
    this.setState({
      game_uuid: game_uuid,
      app_state: "GAME",
    });
  }

  render() {
    let footer =  <footer id="footer">Made with 💔 in a gloomy overpriced SF appartment</footer>;
    if (this.state.app_state == "CONNECTING") {
      return <h1>Connecting...</h1>
    }
    if (this.state.app_state == "LOGIN") {
      return <div>
        <Login onLogin={this.onLogin.bind(this)}></Login>
        {footer}
      </div>;
    }
    if (this.state.app_state == "LOBBY") {
      return <div>
          <Lobby username={this.state.username} database={this.state.database} onGameStarted={this.onGameStarted.bind(this)}></Lobby>
          {footer}
        </div>
    }
    if (this.state.app_state == "GAME") {
      return <Game username={this.state.username} game_uuid={this.state.game_uuid} database={this.state.database}></Game>
    }
    return <div>Oops something went wrong. .</div>
  }
}
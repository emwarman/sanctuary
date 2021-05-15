import React, { Component } from 'react';
import Login from './Login';
import Game from './Game';
import Lobby from './Lobby';
import LobbyBrowser from './LobbyBrowser';
import firebase from "firebase/app";
import "firebase/database";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

const AppStates = [
  "CONNECTING",
  "LOGIN",
  "LOBBY",
  "GAME",
];

export default class App extends Component {
  constructor(props) {
    super(props)
    console.log(props);
    this.state = {
      database: null,
      app_state: "CONNECTING",
      game_id: null,
      lobby_uuid: null,
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

  onConnect(lobby_uuid) {
    this.setState({
      lobby_uuid: lobby_uuid,
      app_state: "LOBBY",
    });
  }

  render_impl() {
    let footer =  <footer id="footer">Made with 💔 in a gloomy overpriced SF appartment</footer>;
    if (this.state.app_state == "CONNECTING") {
      return <h1>Connecting...</h1>
    }
    if (!this.state.username) {
      return <div>
        <Login onLogin={this.onLogin.bind(this)}></Login>
        {footer}
      </div>;
    }

    return <Switch>
      <Route path="/lobby/:id" render={(props) => {
        return <div>
          <Lobby username={this.state.username} database={this.state.database} onGameStarted={this.onGameStarted.bind(this)}></Lobby>
          {footer}
        </div>;
      }}>
      </Route>
      <Route path="/lobby">
        <div>
          <LobbyBrowser username={this.state.username} database={this.state.database} onConnect={this.onConnect.bind(this)}></LobbyBrowser>
          {footer}
        </div>
      </Route>
      <Route path="/game/:id">
        <Game username={this.state.username} database={this.state.database}></Game>
      </Route>
      <Route path="/">
        <Redirect to="/lobby"></Redirect>
      </Route>
    </Switch>;
  }

  render() {
    return <Router>
      {this.render_impl()}
    </Router>
  }
}
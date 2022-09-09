import React, { Component } from 'react';
import Login from './Login';
import Game from './Game';
import Lobby from './Lobby';
import Gallery from './Gallery';
import Help from './Help';
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
    if (!firebase.apps.length) {
      const firebaseConfig = {
        apiKey: "AIzaSyAmYORTgoOVoyF7zZyFXe_XyzwZhZBM6tk",
        authDomain: "sanctuary-7495f.firebaseapp.com",
        databaseURL: "https://sanctuary-7495f-default-rtdb.firebaseio.com",
        projectId: "sanctuary-7495f",
        storageBucket: "sanctuary-7495f.appspot.com",
        messagingSenderId: "592764094021",
        appId: "1:592764094021:web:6b8e29dbca457d1d97c52c"
      };
      let App = firebase.initializeApp(firebaseConfig);
      console.log(App);
      console.log("Initializing!");
    }else {
      console.log("Already exists!");
        firebase.app(); // if already initialized, use that one
    }

    var database = firebase.database();
    
    // database.ref('lobbies/a').set({
    //   users: 'username',
    // });

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
    let footer =  <footer id="footer">Made with 💔 in a gloomy, overpriced, San Francisco appartment. <a href="/about.html">about</a></footer>;
    if (this.state.app_state == "CONNECTING") {
      return <h1>Connecting...</h1>
    }
    const login_component = <Login onLogin={this.onLogin.bind(this)}></Login>;

    return <Switch>
      <Route path="/how_to_play">
        <Help/>
      </Route>
      <Route path="/gallery">
        <div>
          <Gallery/>
          {footer}
        </div>
      </Route>
      <Route path="/lobby/:id" render={(props) => {
        if (this.state.app_state == "LOGIN") {
          return login_component;
        }
        return <div>
          <Lobby username={this.state.username} database={this.state.database} onGameStarted={this.onGameStarted.bind(this)}></Lobby>
          {footer}
        </div>;
      }}/>
      <Route path="/lobby" render={(props) => {
        if (this.state.app_state == "LOGIN") {
          return login_component;
        }
        return <div>
          <LobbyBrowser username={this.state.username} database={this.state.database}/>
          {footer}
        </div>;
      }}/>
      <Route path="/game/:id" render={(props) => {
        if (this.state.app_state == "LOGIN") {
          return login_component;
        }
        return <Game username={this.state.username} database={this.state.database}/>
      }}/>
      <Route path="/">
        <Redirect to="/lobby"/>
      </Route>
    </Switch>;
  }

  render() {
    return <Router>
      {this.render_impl()}
    </Router>
  }
}
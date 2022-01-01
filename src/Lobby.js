import React, { Component } from 'react';
import './Lobby.css';
import {GameState} from './model.mjs'
import {BsFillPersonFill} from 'react-icons/bs';
import {ImEnter} from 'react-icons/im';
import { withRouter } from 'react-router-dom';
import {uuidv4} from './uuid'
const prettyms = require('pretty-ms');

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.database = props.database;
        console.log(this.database);
        this.joined_lobby_callback = null;
        this.state = {
            current_lobby: null,
            current_lobby_uuid: this.props.match.params.id,
        };
    }

    componentDidMount() {
        this.connectUIToLobby(this.props.match.params.id);
    }

    async startGame(lobby_uuid) {
        let newGame = GameState.createNewGame(this.state.current_lobby.users);
        let game_uuid = uuidv4();
        let ser = newGame.serialize();
        await this.database.ref("game/" + game_uuid).set(ser);
        await this.database.ref("lobby/" + lobby_uuid + "/game_id").set(game_uuid);
        this.props.history.push("/game/" + game_uuid);
    }

    async connectUIToLobby(lobby_uuid) {
        let lobby_ref = this.database.ref("lobby/" + lobby_uuid);
        this.joined_lobby_callback = lobby_ref.on('value', this.onLobbyUpdate.bind(this));
        this.setState({
            current_lobby_uuid: lobby_uuid,
        });
    }

    async onLobbyUpdate(lobby) {
        if (!lobby.val()) return;
        if (lobby.val().game_id) {
            this.props.history.push("/game/" + lobby.val().game_id);
        }
        this.setState({
            current_lobby: lobby.val(),
            lobbies: [],
            lobby_lookup: [],
        })
    }

    render() {
        if (!this.state.current_lobby) {
            return <div>Joining...</div>
        }
        let curr_lobby = this.state.current_lobby;
        let is_host = curr_lobby.host == this.props.username;
        let can_start = curr_lobby.users.length > 0;
        let start_button = null;
        if (is_host) {
            start_button = <div><button disabled={!can_start} onClick={this.startGame.bind(this, this.state.current_lobby_uuid)}>start</button></div>;
        }
        let message = can_start ? "Waiting for host to start." : "Waiting for more players...";
        let players = [];
        for (let p of this.state.current_lobby.users) {
            players.push(<div><BsFillPersonFill/>{p} {curr_lobby.host == p ? <b>(host)</b>: ""}</div>);
        }
        return (<div>
            <h1>Current Lobby</h1>
            <h2>Players</h2>
            {players}
            {start_button}
            <div>{message}</div>
        </div>);
    }
}

export default withRouter(Lobby);
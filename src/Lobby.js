import React, { Component } from 'react';
import './Lobby.css';

const prettyms = require('pretty-ms');

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.database = props.database;
        this.state = {
            current_lobby: null,
            lobby_lookup: {},
            lobbies: [],
        };
    }

    componentDidMount() {
        this.database.ref("lobby").on("value", (snapshot) => {
            let lobbies = snapshot.val();
            let lobby_list = [];
            for (let lobby_uuid in snapshot.val()) {
                lobby_list.push({
                    uuid: lobby_uuid,
                    val: lobbies[lobby_uuid],
                });
            }
            this.setState({
                lobbies: lobby_list,
                lobby_lookup: lobbies,
            })
        })
    }

    async createLobby(event) {
        let uuid = uuidv4();
        await this.database.ref("lobby/" + uuid).set({
            created_ms: Date.now(),
            users: [this.props.username],
            game_id: null,
            host: this.props.username,
        });
        this.setState({
            current_lobby: uuid,
        });
    }

    async onJoin(lobby_uuid) {
        let modified_lobby = this.state.lobby_lookup[lobby_uuid];
        modified_lobby.users.push(this.props.username)
        let success = await this.database.ref("lobby/" + lobby_uuid).set(modified_lobby);
        this.setState({
            current_lobby: lobby_uuid
        });
    }

    async startGame(game_uuid) {
        this.props.onGameStarted(game_uuid);
    }

    render() {
        let lobbies = [];
        let in_lobby = this.state.current_lobby != null;
        console.log(this.state.current_lobby);
        console.log(in_lobby);
        for (let lobby of this.state.lobbies) {
            let users_string = lobby.val.users.join(',');
            let age = 'unknown';
            if (lobby.val.created_ms) {
                if ((Date.now() - lobby.val.created_ms) < 2 * 60 * 1000) {
                    age = 'new';
                } else {
                    age = prettyms(Date.now() - lobby.val.created_ms);
                }
            }
            let selected = lobby.uuid == this.state.current_lobby;
            if (in_lobby && !selected) {
                continue;
            }
            lobbies.push(<div className='lobby-row' id={selected ? 'joined-lobby' : ''}>players: {users_string} age: {age}<button disabled={in_lobby} onClick={this.onJoin.bind(this, lobby.uuid)}>join</button></div>)
        }
        if (in_lobby) {
            let curr_lobby = this.state.lobby_lookup[this.state.current_lobby];
            let is_host = this.state.lobby_lookup[this.state.current_lobby].host == this.props.username;
            lobbies.push(<div><button disabled={curr_lobby.users.length < 2}>start</button></div>)
        }
        
        return (
            <body>
                <h1>Lobbies</h1>
                <button disabled={in_lobby} onClick={this.createLobby.bind(this)}>Create Lobby</button>
                {lobbies}
            </body>
        );
    }
}

import React, { Component } from 'react';
import './Lobby.css';
import {GameState} from './model.mjs'
import {BsFillPersonFill} from 'react-icons/bs';
import {ImEnter} from 'react-icons/im';
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
        this.all_lobby_callback = null; // Used to unsub
        this.joined_lobby_callback = null;
        this.state = {
            current_lobby_uuid: null,
            current_lobby: null,
            lobby_lookup: {},
            lobbies: [],
        };
    }

    subscribeToLobbyList(){
        this.all_lobby_callback = this.database.ref("lobby").on("value", (snapshot) => {
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
            });
        });
    }

    componentDidMount() {
        this.subscribeToLobbyList();
    }

    async createLobby(event) {
        let uuid = uuidv4();
        let lobby_ref = this.database.ref("lobby/" + uuid);
        await lobby_ref.set({
            created_ms: Date.now(),
            users: [this.props.username],
            game_id: null,
            host: this.props.username,
        });
        this.joined_lobby_callback = lobby_ref.on('value', this.onLobbyUpdate.bind(this));
        this.setState({
            current_lobby_uuid: uuid,
        });
    }

    async onJoin(lobby_uuid) {
        let modified_lobby = this.state.lobby_lookup[lobby_uuid];
        modified_lobby.users.push(this.props.username);
        await this.database.ref("lobby").off('value', this.all_lobby_callback);
        let lobby_ref = this.database.ref("lobby/" + lobby_uuid);
        await lobby_ref.set(modified_lobby);
        this.joined_lobby_callback = lobby_ref.on('value', this.onLobbyUpdate.bind(this));
        this.setState({
            current_lobby_uuid: lobby_uuid,
        });
    }

    async onLobbyUpdate(lobby) {
        if (lobby.val().game_id) {
            // this.database.ref("lobby/" + this.) unsub?
            this.props.onGameStarted(lobby.val().game_id);
        }
        this.setState({
            current_lobby: lobby.val(),
            lobbies: [],
            lobby_lookup: [],
        })
    }

    async startGame(lobby_uuid) {
        let newGame = GameState.createNewGame(this.state.current_lobby.users);
        let game_uuid = uuidv4();
        let ser = newGame.serialize();
        console.log(ser);
        await this.database.ref("game/" + game_uuid).set(ser);
        await this.database.ref("lobby/" + lobby_uuid + "/game_id").set(game_uuid);
    }

    render() {
        if (this.state.current_lobby) {
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
                players.push(<div><BsFillPersonFill/>{p}</div>);
            }
            return (<body>
                <h1>Current Lobby</h1>
                <h2>Players</h2>
                {players}
                {start_button}
                <div>{message}</div>
            </body>);
        }

        let lobbies_components = [];
        let lobbies = this.state.lobbies.filter(lobby => Date.now() - lobby.val.created_ms < 1*60*60*1000);
        lobbies.filter((lobby) => lobby.val.game_id ? false : true);
        lobbies.sort((a, b) => a.created_ms > b.created_ms);
        for (let lobby of lobbies) {
            let users_string = lobby.val.users.join(',');
            let age = 'unknown';
            if (lobby.val.created_ms) {
                if ((Date.now() - lobby.val.created_ms) < 2 * 60 * 1000) {
                    age = 'new';
                } else {
                    age = prettyms(Date.now() - lobby.val.created_ms);
                }
            }
            let selected = lobby.uuid == this.state.current_lobby_uuid;
            lobbies_components.push(<div className='lobby-row' id={selected ? 'joined-lobby' : ''}><button className="join" onClick={this.onJoin.bind(this, lobby.uuid)}>join <ImEnter/></button>players: {users_string} age: {age}</div>)
        }
        
        return (
            <body>
                <h1>Lobbies</h1>
                <div>Welcome {this.props.username}   <button onClick={this.createLobby.bind(this)}>Create Lobby</button></div>
                
                {lobbies_components}
            </body>
        );
    }
}

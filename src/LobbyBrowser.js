import React, { Component } from 'react';
import './Lobby.css';
import {GameState} from './model.mjs'
import {ImEnter} from 'react-icons/im';
import {uuidv4} from './uuid'
import {
    Redirect,
  } from "react-router-dom";
const prettyms = require('pretty-ms');

export default class LobbyBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.database = props.database;
        this.all_lobby_callback = null; // Used to unsub
        this.state = {
            lobby_lookup: {},
            lobbies: [],
            lobby_join_uuid: null,
        };
    }

    componentDidMount() {
        this.subscribeToLobbyList();
    }

    componentWillUnmount() {
        this.database.ref("lobby").off('value', this.all_lobby_callback);
    }

    async onJoin(lobby_uuid) {
        let modified_lobby = this.state.lobby_lookup[lobby_uuid];
        modified_lobby.users.push(this.props.username);
        await this.database.ref("lobby").off('value', this.all_lobby_callback);
        let lobby_ref = this.database.ref("lobby/" + lobby_uuid);
        await lobby_ref.set(modified_lobby);
        this.setState({
            lobby_join_uuid: lobby_uuid,
        });
    }

    subscribeToLobbyList(){
        console.log("subscribeToLobbyList")
        this.all_lobby_callback = this.database.ref("lobby").on("value", (snapshot) => {
            console.log("a");
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

    async createLobby(event) {
        let uuid = uuidv4();
        let lobby_ref = this.database.ref("lobby/" + uuid);
        await lobby_ref.set({
            created_ms: Date.now(),
            users: [this.props.username],
            game_id: null,
            host: this.props.username,
        });
        this.setState({
            lobby_join_uuid: uuid,
        });
    }

    render() {
        if (this.state.lobby_join_uuid) {
            return <Redirect to={"/lobby/"+this.state.lobby_join_uuid}></Redirect>;
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
import React, { Component } from 'react';
import './Lobby.css';
import {GameState} from './model.mjs'
import {ImEnter} from 'react-icons/im';
import {GiBinoculars} from 'react-icons/gi';
import {uuidv4} from './uuid'
import { withRouter } from 'react-router-dom';
import {BsFillPersonFill, BsPerson} from 'react-icons/bs';

const prettyms = require('pretty-ms');

class LobbyBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.database = props.database;
        this.all_lobby_callback = null; // Used to unsub
        this.state = {
            lobby_lookup: {},
            lobbies: [],
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
        let lobby_ref = this.database.ref("lobby/" + lobby_uuid);
        await lobby_ref.set(modified_lobby);
        this.props.history.push("/lobby/" + lobby_uuid);
    }

    onSpectate(lobby_uuid) {
        this.props.history.push("/lobby/" + lobby_uuid);
    }

    subscribeToLobbyList(){
        console.log("subscribeToLobbyList")
        this.all_lobby_callback = this.database.ref("lobby").on("value", (snapshot) => {
            console.log("a");
            let lobbies = snapshot.val();
            let lobby_list = [];
            for (let lobby_uuid in snapshot.val()) {
                console.log(lobby_uuid);
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
        console.log(this.database);
        let lobby_ref = this.database.ref("lobby/" + uuid);
        await lobby_ref.set({
            created_ms: Date.now(),
            max_players: 2,
            users: [this.props.username],
            game_id: null,
            host: this.props.username,
        });
        this.props.history.push("/lobby/" + uuid);
    }

    render() {
        let table_rows = [];
        let lobbies = this.state.lobbies.filter(lobby => (Date.now() - lobby.val.created_ms) < 1*60*60*1000);
        lobbies = lobbies.filter((lobby) => lobby.val.game_id ? false : true);
        lobbies.sort((a, b) => a.val.created_ms > b.val.created_ms);
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
            let can_join = lobby.val.users.indexOf(this.props.username) == -1;
            can_join = can_join && lobby.val.users.length < lobby.val.max_players;
            let num_empty = (lobby.val.max_players - lobby.val.users.length) || 0;
            let empty = [];
            for (let i = 0; i < num_empty; i++) {
                empty.push(<BsPerson/>);
            }
            table_rows.push(<tr>
                <td>{lobby.val.host}</td>
                <td>{age}</td>
                <td>{lobby.val.users.map((username) => <BsFillPersonFill/>)}{empty}</td>
                <td>
                    <button className="join pure-button" disabled={!can_join} onClick={this.onJoin.bind(this, lobby.uuid)}>Enter<ImEnter/></button>
                    <button className="join pure-button" onClick={this.onSpectate.bind(this, lobby.uuid)}>Spectate<GiBinoculars/></button>
                </td>
            </tr>);
        }

        let table = <table className="pure-table" id="lobby_table">
            <thead>
                <tr>
                    <th>Host</th>
                    <th className="lobby-age-column">Age</th>
                    <th className="lobby-max-column">Players</th>
                    <th className="lobby-buttons-column">    
                    </th>
                </tr>
            </thead>
            <tbody>
                {table_rows}
            </tbody>
        </table> 
        if (table_rows.length == 0) {
            table = <div>No open games... start one by clicking "Create Lobby" above!</div>
        }
        
        return (
            <div>
                <h1>Lobbies</h1>
                <div id='how-to-play-header'>
                    <a href="/how_to_play">how to play</a>
                </div>
                {table}
                <button className="pure-button pure-button-primary" id="create-lobby-button" onClick={this.createLobby.bind(this)}>Create Lobby</button>
            </div>
        );
    }
}

export default withRouter(LobbyBrowser);
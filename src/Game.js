import './Game.css';
import Card from './Card.js';
import {GameState} from './model.mjs'
import {Arboretum} from './Arboretum'
import React, { Component } from 'react';

const GameStates = [
  "JOINING_GAME",
  "WAITING_FOR_TURN",
  "DRAW",
  "PLAY",
  "DISCARD",
  "GAME_OVER",
];

const MaxCards = 9;

export default class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      player: props.username,
      game_state: "JOINING_GAME",
      game_model: null,
      selected_card: -1,
    }
  }

  drawPressed() {
    this.state.game_model.drawCard();
    if (this.state.game_model.getPlayer(this.state.player).hand.length >= MaxCards) {
      this.setState({
        game_state: "PLAY",
      })
    } else {
      // this.state.game_model isn't internally understood by react state, so mutating it with drawCard() wont trigger rerender.
      this.forceUpdate();
    }
    
  }

  componentDidMount() {
    // TODO: Actually sync with other clients.
    setTimeout(() => {
      let newGame = GameState.createNewGame(["thomas", "emily"]); // This should be run on host and distributed to all clients.
      this.setState({
        game_model: newGame,
        game_state: "WAITING_FOR_TURN",
      }, () => {this.onTurnStart()});
    }, 1000);
  }

  onTurnStart() {
    if (this.state.game_model.turn == this.state.game_model.turn) {
      this.setState({
        game_state: "DRAW",
      });
    }
  }

  selectedCard(index) {
    if (this.state.game_state == "PLAY" || this.state.game_state == "DISCARD") {
      this.setState({
        selected_card: index
      });
    }
  }

  onPlay(position) {
    let player = this.state.game_model.getPlayer(this.state.player);
    let card = player.hand[this.state.selected_card];
    this.state.game_model.playCard(card, position);
    this.setState({
      selected_card: -1,
      game_state: "DISCARD",
    });
  }

  onDiscard() {
    let player = this.state.game_model.getPlayer(this.state.player);
    let card = player.hand[this.state.selected_card];
    this.state.game_model.discard(card);
    this.setState({
      selected_card: -1,
      game_state: "WAITING_FOR_TURN",
    });
  }

  render() {
    if (this.state.game_state == "JOINING_GAME") {
      return <div>Joining game as {this.state.player}... Please wait.</div>
    }

    let hand_view = this.state.game_model.getPlayer(this.state.player).hand.map((card, index) => 
      <Card species={card.species} value={card.value} selected={this.state.selected_card == index} onClick={this.selectedCard.bind(this, index)}/>
    );
  
    let sanctuary_components = this.state.game_model.players.map((player) => {
      let enabled = this.state.game_state == "PLAY" && this.state.selected_card > 0;
      return <div>
        <Arboretum name={player.username} arboretum={player.arboretum} enabled={enabled} onPlay={this.onPlay.bind(this)}></Arboretum>
      </div>
    });
    let discard = !(this.state.game_state == "DISCARD" && this.state.selected_card > 0);
    return (
      <div>
        <h1>Sanctuary</h1>
        <div>Game State: <b>{this.state.game_state}</b></div>
        <div>Deck: {this.state.game_model.deck.length} cards</div>
        <button disabled={this.state.game_state != "DRAW"} onClick={this.drawPressed.bind(this)}>
          Draw Card
        </button>
        <button disabled={discard} onClick={this.onDiscard.bind(this)}>
          Discard
        </button>
        <div><h3>Your Hand: ({hand_view.length})</h3></div>
        <div id="hand">{hand_view}</div>
        <br clear="all"></br>
        <div>Sanctuaries: {sanctuary_components}</div>
        <br clear="all"></br>
        <div>Made with 💔 in a gloomy overpriced SF appartment</div>
      </div>
    );
  }
}
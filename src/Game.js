import './Game.css';
import Card from './Card.js';
import {GameState} from './model.mjs'
import {Sanctuary} from './Sanctuary'
import React, { Component } from 'react';
import {GiCardDraw, GiUpCard} from 'react-icons/gi';
import Discard from './Discard'

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

  onGameModelChanged(new_game_model) {
    console.log("New game state recieved.");
    console.log(new_game_model);
    let new_game_state = this.state.game_state;
    if (!new_game_model.deck) {
        console.log("Game over");
        this.setState({
            game_model: new_game_model,
            game_state: "GAME_OVER",
        });
    }
    if (this.state.game_state == "WAITING_FOR_TURN" || this.state.game_state == "JOINING_GAME" || this.state.game_state == "DISCARD") {
        if (new_game_model.turn == this.props.username) {
            new_game_state = "DRAW";
        } else {
            new_game_state ="WAITING_FOR_TURN";
        }
    }
    this.setState({
        game_model: new_game_model,
        game_state: new_game_state,
    });
  }

  async componentDidMount() {
    this.network_state_callback = this.props.database.ref("game/" + this.props.game_uuid).on('value', snapshot => {
        this.onGameModelChanged(new GameState(snapshot.val()));
    });
  }

  async onTurnEnd() {
      this.state.game_model.endTurn();
      await this.props.database.ref("game/" + this.props.game_uuid).set(this.state.game_model.serialize());
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
    if (this.state.selected_card < 0) {
        alert('Select a card to play!');
        return;
    }
    let card = player.hand[this.state.selected_card];
    this.state.game_model.playCard(card, position);
    this.setState({
      selected_card: -1,
      game_state: "DISCARD",
    });
    console.log(this.state.game_model);
    this.forceUpdate();
  }

  onDiscard() {
    let player = this.state.game_model.getPlayer(this.state.player);
    let card = player.hand[this.state.selected_card];
    this.state.game_model.discard(card);
    this.setState({
      selected_card: -1,
      game_state: "WAITING_FOR_TURN",
    });
    this.onTurnEnd();
  }

  onDraw(player) {
    this.state.game_model.drawDiscard(player);
    if (this.state.game_model.getPlayer(this.state.player).hand.length >= MaxCards) {
        this.setState({
          game_state: "PLAY",
        })
      } else {
         // this.state.game_model isn't internally understood by react state, so mutating it with drawDiscard() wont trigger rerender.
        this.forceUpdate();
      }
  }

  render() {
    if (this.state.game_state == "JOINING_GAME") {
      return <div>Joining game as {this.state.player}... Please wait.</div>
    }

    let hand_view = this.state.game_model.getPlayer(this.state.player).hand.map((card, index) => 
      <Card className={index ? " offset" : ""} species={card.species} value={card.value} selected={this.state.selected_card == index} onClick={this.selectedCard.bind(this, index)}/>
    );
  
    let curr_player = this.state.game_model.getPlayer(this.state.player);
    let enabled = this.state.game_state == "PLAY" && this.state.selected_card > -1;
    let player_sanctuary = <Sanctuary 
        game_state={this.state.game_state} 
        name={curr_player.username} 
        sanctuary={curr_player.sanctuary} 
        enabled={enabled} 
        onPlay={this.onPlay.bind(this)}></Sanctuary>;
    let sanctuary_components = this.state.game_model.players.filter(player => player.username != this.state.player).map((player) => {
      return <div>
        <Sanctuary game_state={this.state.game_state} name={player.username} sanctuary={player.sanctuary} enabled={false} onPlay={this.onPlay.bind(this)}></Sanctuary>
        <Discard small={true} game_state={this.state.game_state} cards={player.discard} player={player.username} onDraw={_ => this.onDraw(player.username)}></Discard>
      </div>
    });
    let can_discard = !(this.state.game_state == "DISCARD" && this.state.selected_card > -1);
    return (
      <div>
        <h1>Sanctuary</h1>
        <div class="pure-g">
            <div class="pure-u-2-3">
            <div>Game State: <b>{this.state.game_state}</b></div>
            <div>Deck: {this.state.game_model.deck.length} cards</div>
            <button disabled={this.state.game_state != "DRAW"} onClick={this.drawPressed.bind(this)}>
                Draw Card<GiUpCard/>
            </button>
            <button disabled={can_discard} onClick={this.onDiscard.bind(this)}>
                Discard <GiCardDraw/>
            </button>
                {player_sanctuary}
            </div>
            <div class="pure-u-1-3">
                <h3>Opponents:</h3>
                {sanctuary_components}
            </div>
        </div>
        <div id="bottom-pannel">
            <div id="bottom-pannel-left">
                <h3>Your Hand: ({hand_view.length})</h3>
                <div id="hand">{hand_view}</div>
            </div>
            <div id="bottom-pannel-right">
                <Discard game_state={this.state.game_state} cards={curr_player.discard} player={curr_player.username} onDraw={_ => this.onDraw(curr_player.username)}></Discard>
            </div>
        </div>
        
        <br clear="all"></br>
        
        <br clear="all"></br>
      </div>
    );
  }
}
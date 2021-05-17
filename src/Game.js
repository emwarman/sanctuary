import './Game.css';
import Card from './Card.js';
import {GameState} from './model.mjs'
import {Sanctuary} from './Sanctuary'
import React, { Component } from 'react';
import {GiCardDraw, GiUpCard} from 'react-icons/gi';
import Discard from './Discard'
import { withRouter, Link } from 'react-router-dom';
import Modal from 'react-modal';
import ScoreScreen from './ScoreScreen';
import HelpComponent from './Help';

const GameStates = [
  "JOINING_GAME",
  "WAITING_FOR_TURN",
  "DRAW",
  "PLAY",
  "DISCARD",
  "GAME_OVER",
  "SPECTATOR",
];

const MaxCards = 9;

const isActive = function(game_state) {
    if (game_state == "DRAW" || game_state == "PLAY" || game_state == "DISCARD") {
        return true;
    }
    return false;
}

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      player: props.username,
      game_state: "JOINING_GAME",
      game_model: null,
      selected_card: -1,
      help_model_enabled: false,
      score_screen_modal_open: false,
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

  isSpectator() {
      console.log(this.state.game_model.players.map((p) => p.username));
      console.log(this.state.player);
      return !this.state.game_model.players.map((p) => p.username).includes(this.state.player);
  }

  onGameModelChanged(new_game_model) {
    console.log("New game state recieved.");
    let new_game_state = this.state.game_state;
    if (new_game_model.deck.length == 0) {
        console.log("Game over");
        this.setState({
            game_model: new_game_model,
            game_state: "GAME_OVER",
            score_screen_modal_open: true,
        });
        return;
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
      console.log(this.props);
    this.network_state_callback = this.props.database.ref("game/" + this.props.match.params.id).on('value', snapshot => {
        this.onGameModelChanged(new GameState(snapshot.val()));
    });
  }

  async onTurnEnd() {
      console.log("On turn end");
      this.state.game_model.endTurn();
      await this.props.database.ref("game/" + this.props.match.params.id).set(this.state.game_model.serialize());
      this.onGameModelChanged(this.state.game_model);
      this.setState({
          selected_card: -1,
      });
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
    console.log("onDiscard");
    let player = this.state.game_model.getPlayer(this.state.player);
    let card = player.hand[this.state.selected_card];
    this.state.game_model.discard(card);
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

    console.log("isSpectator: " + this.isSpectator());
    let should_hide_hand = this.isSpectator() || this.state.game_state == "GAME_OVER";
    let curr_player = this.state.game_model.getPlayer(this.isSpectator() ? this.state.game_model.turn : this.state.player);
    let hand_view = should_hide_hand ? null : curr_player.hand.map((card, index) => 
        <Card style={{'position': 'fixed', 'margin-left': (50*index) + 'px'}} species={card.species} value={card.value} selected={this.state.selected_card == index} onClick={this.selectedCard.bind(this, index)}/>
    );

    let player_sanctuary = this.isSpectator() ? null : <Sanctuary 
        game_state={this.state.game_state} 
        name={curr_player.username} 
        sanctuary={curr_player.sanctuary} 
        enabled={this.state.game_state == "PLAY" && this.state.selected_card > -1} 
        onPlay={this.onPlay.bind(this)}></Sanctuary>;
    
    let sanctuary_components = this.state.game_model.players.filter(player => player.username != curr_player.username).map((player) => {
      return <div>
        <Sanctuary game_state={this.state.game_state} name={player.username} sanctuary={player.sanctuary} enabled={false} onPlay={this.onPlay.bind(this)}></Sanctuary>
        <Discard small={true} game_state={this.state.game_state} cards={player.discard} player={player.username} onDraw={_ => this.onDraw(player.username)}></Discard>
      </div>
    });
    let can_discard = !(this.state.game_state == "DISCARD" && this.state.selected_card > -1);
    let modal = <Modal
          isOpen={this.state.score_screen_modal_open}
        //   onAfterOpen={afterOpenModal}
        //   onRequestClose={closeModal}
          style={{
              content: {
                'inset': '80px',
              }
          }}
          contentLabel="Example Modal"
        >
            {/* <h3>Game over!</h3> */}
            <ScoreScreen onClose={() => this.setState({score_screen_modal_open: false})} game_model={this.state.game_model}/>
        </Modal>;

    let help_modal = <Modal
        isOpen={this.state.help_model_enabled}
        //   onAfterOpen={afterOpenModal}
        //   onRequestClose={closeModal}
        contentLabel="Example Modal"
        >
        <HelpComponent/>
        <button onClick={() => this.setState({help_model_enabled: false})} className="pure-button">Done</button>
    </Modal>;
    return (
      <div>
        <div class="pure-menu pure-menu-horizontal">
            <div className="pure-menu-item" style={{
                'font-size': '30px',
            }}>Sanctuary</div>
            <ul class="pure-menu-list">
                {this.state.game_state == "GAME_OVER" ? <li class="pure-menu-item">
                    <a href="#" class="pure-menu-link" onClick={() => this.setState({score_screen_modal_open: true})}>Score Screen</a>
                </li> : null}
                <li class="pure-menu-item">
                    <a href="#" class="pure-menu-link" onClick={() => this.setState({help_model_enabled: true})}>Help</a>
                </li>
                <li class="pure-menu-item">
                    <a href="/lobby" class="pure-menu-link" onClick={() => alert('not implement')}>{this.state.game_state == "GAME_OVER" ? "Exit": "Resign"}</a>
                </li>
            </ul>
        </div>
          {modal}
          {help_modal}
        <div class="pure-g">
            <div class="pure-u-1-2">
            <div>Game State: <b className={isActive(this.state.game_state) ? "active" : ""}>{this.state.game_state}</b></div>
            <div>Deck: {this.state.game_model.deck.length} cards</div>
            <button disabled={this.state.game_state != "DRAW"} onClick={this.drawPressed.bind(this)}>
                Draw Card<GiUpCard/>
            </button>
            <button disabled={can_discard} onClick={this.onDiscard.bind(this)}>
                Discard <GiCardDraw/>
            </button>
                {player_sanctuary}
            </div>
            <div class="pure-u-1-2">
                <h3>Opponents:</h3>
                {sanctuary_components}
            </div>
        </div>
        <div id="bottom-pannel">
            <div class="pure-g">
                <div class="pure-u-1-8"> 
                    <Discard game_state={this.state.game_state} cards={curr_player.discard} player={curr_player.username} onDraw={_ => this.onDraw(curr_player.username)}></Discard>
                </div>
                <div class="pure-u-7-8"> 
                    <div id="bottom-pannel-left">
                        <h3>Your Hand: ({hand_view?.length || 0})</h3>
                        <div id="hand">{hand_view}</div>
                    </div>
                </div>
            </div>
            
            {/* <div id="bottom-pannel-right">
            
            </div> */}
        </div>
        
        <br clear="all"></br>
        
        <br clear="all"></br>
      </div>
    );
  }
}

export default withRouter(Game);
import React, { Component } from 'react';
import firebase from 'firebase';
import './App.css';
import Card from './Card.js';
import {GameState} from './model.mjs'
import {Arboretum} from './Arboretum'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.firebase = firebase.apps[0];
    this.gs = GameState.createNewGame(["thomas", "emily"]);
    this.local_player = "thomas";
  }

  drawPressed() {
    this.gs.drawCard();
    this.forceUpdate()
  }

  render() {
    let hand_view = this.gs.getPlayer("thomas").hand.map(card => 
      <Card species={card.species} value={card.value}/>
    );

    let curr_player_arb = this.gs.getPlayer(this.gs.turn).arboretum;
  
    return (
      <div>
        <div>Deck: {this.gs.deck.length} cards</div>
        <button onClick={this.drawPressed.bind(this)}>
          Draw Card
        </button>
        <div>Hand:</div>
        <div id="hand">{hand_view}</div>
        <Arboretum arboretum={curr_player_arb}></Arboretum>
      </div>
    );
  }
}
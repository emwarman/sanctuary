import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Scorer, Species} from './model'
import Card from './Card'

const APOSTROPHE_CHAR = '’';
function possessive(string) {
    if(string == '') {
      return string;
    }
    var lastChar = string.slice(-1);
    var endOfWord = lastChar.toLowerCase() == 's' ? APOSTROPHE_CHAR : `${APOSTROPHE_CHAR}s`;
    return `${string}${endOfWord}`;
}
  
export default function ScoreScreen(props) {
    let total_scores = {};
    for (let player of props.game_model.players) {
        if (total_scores[player.username] == undefined) {
            total_scores[player.username] = 0;
        }
        
    }
    let rows = Species.map((spec) => 
        <tr>
            <td className={spec}>{spec}</td>
            {props.game_model.players.map((player) => {
                let points = Scorer.scoreSpecies(player.sanctuary, spec);
                let can_score = props.game_model.rightToScore(spec).includes(player);
                // console.log(can_score && (points > 0));
                if (can_score) {
                    total_scores[player.username] += points;
                }
                return <td className={(can_score ? `gained-points ${spec}` : 'lost-points')}>{points}</td>
            })}
        </tr>
    );

    rows.push(<tr>
        <td><b>Total</b></td>
        {props.game_model.players.map((player) => {
            return <td>{total_scores[player.username]}</td>
        })}
    </tr>);

    let hands = props.game_model.players.map((player) => <div style={{display: 'block', width: '100%'}}>
        <h4>{possessive(player.username)} hand</h4>
        {player.hand.map((card, index) => <Card className=" small" small={true} style={{'position': 'relative'}} species={card.species} value={card.value}/>)}
    </div>);
    
    return <div>
        <h3>Game Over!</h3>
        <br/>
        {hands}
        <br/>
        <table class="pure-table">
            <thead>
                <tr>
                    <th>Geode</th>
                    {props.game_model.players.map((player) => <th>{player.username}</th>)}
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
        <br/>
        <button onClick={props.onClose} className='pure-button'>Return to Game</button>
        <Link to="/lobby"><button className="pure-button">Exit</button></Link>
    </div>
}
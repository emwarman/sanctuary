import React, {Component} from 'react';
import Card from './Card'
import {GiCardDraw, GiUpCard} from 'react-icons/gi';

export default function Discard(props) {
    let cards = props.cards || [];
    let len = cards.length;
    let card_components = [];
    if (len == 0) {
        card_components.push(<div className={"card placeholder" + (props.small ? " small" : "")}></div>)
    }
    if (len == 1) {
        card_components = [<Card className={props.small ? " small" : ""} species={cards[0].species} value={cards[0].value}></Card>];
    }
    if (len > 1) {
        card_components = [
            <Card className={props.small ? " small" : ""} species={cards[len-2].species} value={cards[len-2].value}></Card>,
            <Card className={" offset" + (props.small ? " small" : "")} species={cards[len-1].species} value={cards[len-1].value}></Card>
        ]
    }
    let is_enabled = props.game_state == "DRAW" && len > 0;
    return <div>
        <div>
            <b>Discard ({props.player})</b> 
            <button disabled={!is_enabled} onClick={props.onDraw}>
                Draw Card<GiUpCard/>
            </button>
        </div>
        {card_components}
    </div>
};
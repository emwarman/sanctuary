import './Game.css';
import Card from './Card.js';
import {Species} from './model.mjs'

function Game(props) {
    let cards = [];
    for (let card of Species) {
        cards.push(<Card species={card} value={1}/>)
    }
    return cards;
}
export default Game;
import React, {Component} from 'react';
import Card from './Card.js';
import {Position} from './model.mjs';

export class Sanctuary extends Component {
    constructor(props) {
        super(props);
    }
                      
    render() {
        let sanctuary = this.props.sanctuary
        
        let rows = [];
        for (let y = sanctuary.minY(); y <= sanctuary.maxY(); y ++) {
            let row = []
            for (let x = sanctuary.minX(); x <= sanctuary.maxX(); x ++) {
                let position = new Position({'x': x, 'y': y});
                if (sanctuary.hasStone(position)) {
                    let card = sanctuary.getStone(position).card
                    row.push(<div className="gridSquare"><Card species={card.species} value={card.value}/></div>)
                } else if (sanctuary.isPlayable(position) && this.props.game_state == "PLAY") {
                    row.push(<div className="gridSquare card playable" onClick={() => this.props.onPlay(position)}></div>)
                } else {
                    row.push(<div className="gridSquare card"></div>)
                }
            }
            rows.push(<div>{row}</div>)
        }
        return (
            <div className='arboretum'>
                {rows}
            </div>
        )
    }
}
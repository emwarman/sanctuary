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
        let margin = this.props.enabled ? 1 : 0;
        let num_stones = sanctuary.stones.length;
        if (num_stones == 0) {
            console.log("enabled: " + this.props.enabled);
            let classes = "gridSquare card placeholder small";
            if (this.props.enabled) {
                classes += " playable"
            }
            let callback = this.props.enabled ? (() => this.props.onPlay(Position.center())) : undefined;
            return <div className='arboretum'>
                <h4>Sanctuary: <b>{this.props.name}</b></h4>
                <div className={classes} onClick={callback}></div>
            </div>
        }
        for (let y = sanctuary.minY() - margin; y <= sanctuary.maxY() + margin; y ++) {
            let row = []
            for (let x = sanctuary.minX() - margin; x <= sanctuary.maxX() + margin; x ++) {
                let position = new Position({'x': x, 'y': y});
                if (sanctuary.hasStone(position)) {
                    let card = sanctuary.getStone(position).card
                    row.push(<div className="gridSquare small"><Card className=" small" species={card.species} value={card.value}/></div>)
                } else if (this.props.enabled && sanctuary.isPlayable(position)) {
                    row.push(<div className="gridSquare card playable placeholder small" onClick={() => this.props.onPlay(position)}></div>)
                } else {
                    row.push(<div className="gridSquare card placeholder small"></div>)
                }
            }
            rows.push(<div>{row}</div>)
        }
        return (
            <div className='arboretum'>
                <h4>Sanctuary: {this.props.name}</h4>
                {rows}
            </div>
        )
    }
}
import React, {Component} from 'react';
import { GiStoneSphere } from 'react-icons/gi';
import {IconContext} from 'react-icons'
import './Card.css'

const speciesColors = {
    "maple": "darkorange",
    "cherryBlossom": "hotpink",
    "blueSpruce": "darkslategrey",
    "jacaranda": "darkviolet",
    "oak": "saddlebrown",
    "dogwood": "darkgrey",
    "willow": "darkolivegreen",
    "tulipPoplar": "limeGreen",
    "cassia": "gold",
    "royalPoinciana": "red"
};

class Card extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var speciesColor = speciesColors[this.props.species];
        let classes = "card" + (this.props.selected ? " selected" : "") + (this.props.className || "");
        return(
            <div className={classes} onClick={this.props.onClick}>
                <div className={this.props.species + " number"}> {this.props.value}</div>
                <IconContext.Provider value={{ className: 'cardgraphic ' +  this.props.species}}>
                    <GiStoneSphere />
                </IconContext.Provider>
            </div>
        )
    }
}

export default Card;
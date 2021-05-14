import React, {Component} from 'react';
import { GiFruitTree } from 'react-icons/gi';

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
        let classes = "card" + (this.props.selected ? " selected" : "");
        return(
            <div className={classes} onClick={this.props.onClick}>
                <span style={{color: speciesColor}}> {this.props.value} <GiFruitTree/ ></span>
            </div>
        )
    }
}

export default Card;
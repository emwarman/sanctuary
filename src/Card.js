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

function Card(props) {
    let classes = "card" + (props.selected ? " selected" : "") + (props.className || "");
    return(
        <div style={props.style} className={classes} onClick={props.onClick}>
            <div className={props.species + " number"}> {props.value}</div>
            <IconContext.Provider value={{ className: 'cardgraphic ' +  props.species}}>
                <GiStoneSphere />
            </IconContext.Provider>
        </div>
    );
}

export default Card;
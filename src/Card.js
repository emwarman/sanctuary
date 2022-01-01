import React, {Component} from 'react';
import { GiStoneSphere } from 'react-icons/gi';
import {IconContext} from 'react-icons'
import './Card.css'


const rocksAssets = {
    // "amber": "/assets/amber.png",
    // TODO
    // "quartz": "hotpink",
    // "jade": "limeGreen",
    // "pyrite": "gold",
    // "obsidian": "black",
    // "cinnabar": "red",
    // "sodalite": "blue",
    // "amethyst": "purple",
    // "slate": "darkgrey",
    // "tiger": "saddlebrown"
}

const rocksDisplay = {
    "amber": "Amber",
    // TODO
    "quartz": "quartz",
    "jade": "jade",
    "pyrite": "pyrite",
    "obsidian": "obsidian",
    "cinnabar": "cinnabar",
    "sodalite": "sodalite",
    "amethyst": "amethyst",
    "slate": "slate",
    "tiger": "tiger"
}

function Card(props) {
    let classes = "card" + (props.selected ? " selected" : "") + (props.className || "");
    let graphic;
    console.log(props.species);
    if (props.species in rocksAssets) {
        graphic = <img className={"cardgraphicimg " + props.species} src={rocksAssets[props.species]}></img>
    } else {
        graphic = <IconContext.Provider value={{ className: 'cardgraphic ' +  props.species}}>
            <GiStoneSphere />
        </IconContext.Provider>
    }
    return(
        <div style={props.style} className={classes} onClick={props.onClick}>
            <div className={props.species + " number"}> {props.value}</div>
            {graphic}
            {/* <div className="card-footer">{rocksDisplay[props.species]}</div> */}
        </div>
    );
}

export default Card;
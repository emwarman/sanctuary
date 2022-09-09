import React, {Component} from 'react';
import { GiStoneSphere } from 'react-icons/gi';
import {IconContext} from 'react-icons'
import './Card.css'


const rocksAssets = {
    "amber": "/assets/amber.png",
    "quartz": "/assets/quartz.png",
    "jade": "/assets/jade.png",
    "pyrite": "/assets/pyrite.png",
    "obsidian": "/assets/obsidian.png",
    "cinnabar": "/assets/cinnebar.png",
    
    "sodalite": "/assets/sodalite.png",
    "amethyst": "/assets/amethyst.png",
    "slate": "/assets/slate.png",
    "tiger": "/assets/tigers-eye.png",
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
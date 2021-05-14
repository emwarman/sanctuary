import React, {Component} from 'react';

export class Arboretum extends Component {
    constructor(props) {
        super(props);
    }

    onClick(position) {
        this.props.onPlay(position)
    }
                      
    render() {
        let playablePositions = [[0,0]];
        let playComponents = playablePositions.map((pos) => <button disabled={this.props.enabled != true} onClick={this.onClick.bind(this, [0,0])}>Play Card</button>);
        return <div>
                <h3>{this.props.name} Sanctuary has {this.props.arboretum.cards.length} cards and X points.</h3>
                {playComponents}
            </div>
    }
}
import React, {Component} from 'react';

export class Arboretum extends Component {
    constructor(props) {
        super(props);
    }
                      
    render() {
        return <div>arb has {this.props.arboretum.cards.length} cards</div>
    }
}
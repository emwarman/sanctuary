import React, {Component} from 'react';

export default class Player extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(<div className="player">
            <h3>First Component</h3>
            {this.props.displaytext}
            </div>)
    }
}
import React, { Component } from 'react';

export default function HelpComponent(props) {
    return <div>
        <h3>How to Play</h3>
        <p>Points are scored for the longest path per geode class. Only the first and last card in the path need to be the same class to consitute a path. A path must be monotonically increasing (each card is greater than the last).</p>
        <p>For example, in this case, the <span style={{color: 'purple'}}><b>purple</b></span> path scores 7 points. There is a +1 bonus for starting with a 1 and a +2 bonus ending with an 8. So in total, the path is worth 10 points!</p>
        <img src="https://i.imgur.com/0pmgacQ.png"></img>
        <p>There is also a 2x bonus for a sequence of 4 or more geodes of the same color. So in this case <span style={{color: 'gray'}}><b>grey</b></span> scores 4*2 = 8.</p>
        <img src="https://i.imgur.com/2zE1Gla.png"></img>
        <p>When the deck runs out, each player scores. For each geode class, the player with the highest sum of cards in their hand wins the geode type and takes all the points.</p>
    </div>
}
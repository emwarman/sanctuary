import {GameState, Card} from './model.mjs'

let gs = new GameState({
    "players": [
        {
            "name": "username1",
            "hand": [
                {"species": "cassia", "value": 1}
            ],
            "discard": [
                {"species": "cassia", "value": 2}
            ],
            "arboretum": [],
        },
        {
            "name": "username2",
            "hand": [],
            "discard": [],
            "arboretum": [
                {
                    "position": [0,0],
                    "card": {"species": "cassia", "value": 8},
                }
            ]
        }
    ],
    "turn": "username1",
    "deck": [
        {"species": "cassia", "value": 4},
    ],
});

gs.drawCard()


gs.drawDiscard("username1")

gs.playCard(new Card({"species": "cassia", "value": 1}), [0,0])

console.log(gs.serialize());
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
            "arboretum": {
                "positions": [
                    {"x": 0, "y": 0, "empty": true},
                ]
            },
        },
        {
            "name": "username2",
            "hand": [],
            "discard": [],
            "arboretum": {
                    "positions": [
                        {"x": 0, "y": 0, "empty": false, "card": {"species": "cassia", "value": 8}},
                        {"x": -1, "y": 0, "empty": true},
                        {"x": 1, "y": 0, "empty": true},
                        {"x": 0, "y": -1, "empty": true},
                        {"x": 0, "y": 1, "empty": true},
                    ]
                }
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
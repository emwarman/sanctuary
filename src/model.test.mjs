import {GameState, Card, Sanctuary, Scorer, ScorePath} from './model.mjs'

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
            "sanctuary": {
                "stones": [],
            },
        },
        {
            "name": "username2",
            "hand": [],
            "discard": [],
            "sanctuary": {
                    "stones": [],
            }
        }
    ],
    "turn": "username1",
    "deck": [
        {"species": "cassia", "value": 4},
    ],
});

// gs.drawCard()


// gs.drawDiscard("username1")

// gs.playCard(new Card({"species": "cassia", "value": 1}), [0,0])

// console.log(gs.serialize());

let singleCardScorer = new Scorer({
    "sanctuary" : {
        "stones": [
            {
                "position": {
                    "x": 0,
                    "y": 0,
                },
                "card": {
                    "species": "cassia",
                    "value": 2
                }
            }
        ]
    }
})

console.log("SINGLE_CARD");
let singleCardScore = singleCardScorer.scoreSpecies("cassia")
if (singleCardScore !== 0) {
    console.log("FAILED")
} else {
    console.log("SUCCESS!")
}

let noSpeciesScorer = new Scorer({
    "sanctuary" : {
        "stones": [
            {
                "position": {
                    "x": 0,
                    "y": 0,
                },
                "card": {
                    "species": "cassia",
                    "value": 2
                }
            },
            {
                "position": {
                    "x": 1,
                    "y": 0,
                },
                "card": {
                    "species": "oak",
                    "value": 3
                }
            },
            {
                "position": {
                    "x": 2,
                    "y": 0,
                },
                "card": {
                    "species": "jacaranda",
                    "value": 5
                }
            },
            {
                "position": {
                    "x": 0,
                    "y": 1,
                },
                "card": {
                    "species": "maple",
                    "value": 1
                }
            },
        ]
    }
})

console.log("SINGLE_CARD");
let noSpeciesScore = noSpeciesScorer.scoreSpecies("cassia")
if (singleCardScore !== 0) {
    console.log("FAILED")
} else {
    console.log("SUCCESS!")
}
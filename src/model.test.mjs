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
                    "species": "tulip poplar",
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

console.log("NO_SPECIES_CARD");
let noSpeciesScore = noSpeciesScorer.scoreSpecies("cassia")
if (noSpeciesScore !== 0) {
    console.log("FAILED")
} else {
    console.log("SUCCESS!")
}

let noSpeciesEndScorer = new Scorer({
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

console.log("NO_SPECIES_END_CARD");
let noSpeciesEndScore = noSpeciesEndScorer.scoreSpecies("cassia")
if (noSpeciesEndScore !== 0) {
    console.log("FAILED")
} else {
    console.log("SUCCESS!")
}


let scores1Scorer = new Scorer({
    "sanctuary" : {
        "stones": [
            {
                "position": {
                    "x": 0,
                    "y": 0,
                },
                "card": {
                    "species": "cassia",
                    "value": 1
                }
            },
            {
                "position": {
                    "x": 1,
                    "y": 0,
                },
                "card": {
                    "species": "cassia",
                    "value": 2
                }
            },
        ]
    }
})

console.log("SCORES_1");
let scores1Score = scores1Scorer.scoreSpecies("cassia")
if (scores1Score !== 3) {
    console.log("FAILED")
} else {
    console.log("SUCCESS!")
}

let scores8Scorer = new Scorer({
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
                    "species": "cassia",
                    "value": 8
                }
            },
        ]
    }
})

console.log("SCORES_8");
let scores8Score = scores8Scorer.scoreSpecies("cassia")
if (scores8Score !== 4) {
    console.log("FAILED")
} else {
    console.log("SUCCESS!")
}

let fourOfAKindScorer = new Scorer({
    "sanctuary" : {
        "stones": [
            {
                "position": {
                    "x": 0,
                    "y": 0,
                },
                "card": {
                    "species": "cassia",
                    "value": 1
                }
            },
            {
                "position": {
                    "x": 1,
                    "y": 0,
                },
                "card": {
                    "species": "cassia",
                    "value": 3
                }
            },
            {
                "position": {
                    "x": 2,
                    "y": 0,
                },
                "card": {
                    "species": "cassia",
                    "value": 4
                }
            },
            {
                "position": {
                    "x": 3,
                    "y": 0,
                },
                "card": {
                    "species": "cassia",
                    "value": 5
                }
            },
        ]
    }
})

console.log("SCORES_4_OF_A_KIND");
let fourOfAKindScore = fourOfAKindScorer.scoreSpecies("cassia")
if (fourOfAKindScore !== 9) {
    console.log("FAILED")
    console.log(fourOfAKindScore)
} else {
    console.log("SUCCESS!")
}

let allPlayersScore = new GameState({
    "players": [
        {
            "name": "username1",
            "hand": [
                {"species": "cassia", "value": 1},
                {"species": "dogwood", "value": 8},
                {"species": "oak", "value": 2},
                {"species": "oak", "value": 3}
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
            "hand": [
                {"species": "cassia", "value": 3},
                {"species": "dogwood", "value": 1},
                {"species": "oak", "value": 5}
            ],
            "discard": [],
            "sanctuary": {
                    "stones": [],
            }
        },
        {
            "name": "username3",
            "hand": [
                {"species": "dogwood", "value": 7},
            ],
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

console.log("ALL_PLAYERS_SCORE_JACARANDA")
if (allPlayersScore.rightToScore("jacaranda").length === 3) {
    console.log("SUCCESS")
} else {
    console.log("FAILURE")
}

console.log("PLAYER_2_SCORES_CASSIA")
if (allPlayersScore.rightToScore("cassia").length === 1) {
    console.log("SUCCESS")
    console.log(allPlayersScore.rightToScore("cassia"))
} else {
    console.log("FAILURE")
}

console.log("PLAYER_3_SCORES_DOGWOOD")
if (allPlayersScore.rightToScore("dogwood").length === 1) {
    console.log("SUCCESS")
    console.log(allPlayersScore.rightToScore("dogwood"))
} else {
    console.log("FAILURE")
}

console.log("PLAYERS_1_2_SCORE_OAK")
if (allPlayersScore.rightToScore("oak").length === 2) {
    console.log("SUCCESS")
    console.log(allPlayersScore.rightToScore("oak"))
} else {
    console.log("FAILURE")
    console.log(allPlayersScore.rightToScore("oak"))
}
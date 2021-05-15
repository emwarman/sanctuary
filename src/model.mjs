export const Species = [
  "maple",
  "cherryBlossom",
  "blueSpruce",
  "jacaranda",
  "oak",
  "dogwood",
  "willow",
  "tulipPoplar",
  "cassia",
  "royalPoinciana"
];

/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
 function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}

function assertValidGameState(bool) {
  if (!bool) {
    throw "Invalid game state";
  }
}

export class Player {
  constructor(json) {
    if (json) {
      this.username = json["name"];
      this.hand = json["hand"].map(c => new Card(c));
      console.log(json);
      this.sanctuary = new Sanctuary(json["sanctuary"] || {"stones": []});
      this.discard = (json["discard"] || []).map(c => new Card(c));
    } else {
      this.username = "";
      this.hand = [];
      this.sanctuary = new Sanctuary({"stones": []});
      this.discard = [];
    }
  }

  serialize() {
    return {
      "name": this.username,
      "hand": this.hand.map(c => c.serialize()),
      "sanctuary": this.sanctuary.serialize(),
      "discard": this.discard.map(c => c.serialize()),
    }
  }
}

export class Sanctuary {
  constructor(json_list) {
    this.stones = json_list.stones.map(c => new Stone(c))
  }

  hasStone(position) {
    for (let stone of this.stones) {
      if (stone.position.equals(position)) {
        return true;
      }
    };
  }

  addStone(position, card) {
    this.stones.push(new Stone({"position": position, "card": card}))
  }

  getStone(position) {
    for (let stone of this.stones) {
      if (stone.position.equals(position)) {
        return stone
      }
    }
  }

  isPlayable(position) {
    console.log(position);
    // If card has been played at this location, return false.
    if (this.hasStone(position)) {
      return false
    }
    // If no stones have been played, [0,0] is playable.
    if (this.stones.length === 0 && position.equals(Position.center())) {
      return true
    }
    for (let stone of this.stones) {
      if (stone.position.isAdjacent(position)) {
        return true
      }
    }
    return false
  }

  minX() {
    let min_x = 0
    this.stones.forEach(stone => {
      if (stone.position.x < min_x) {
        min_x = stone.position.x
      }
    })
    return min_x
  }

  maxX() {
    let max_x = 0
    this.stones.forEach(stone => {
      if (stone.position.x > max_x) {
        max_x = stone.position.x
      }
    });
    return max_x
  }

  minY() {
    let min_y = 0
    this.stones.forEach(stone => {
      if (stone.position.y < min_y) {
        min_y = stone.position.y;
      }
    })
    return min_y
  }

  maxY() {
    let max_y = 0
    this.stones.forEach(stone => {
      if (stone.position.y > max_y) {
        max_y = stone.position.y
      }
    })
    return max_y
  }

  serialize() {
    return {
      "stones": this.stones.map(p => p.serialize())
    };
  }
}

export class ScorePath {
  constructor(json) {
    this.path = json.path.map(c => new Stone(c))
  }

  end() {
    return this.path[this.path.length - 1]
  }

  canAdd(stone) {
    if (this.end().card.value < stone.card.value) {
      return true
    } else {
      return false
    }
  }

  add(stone) {
    let path = this.path
    path.push(stone)
    return new ScorePath({"path": path})
  }

  canScore() {
    if (this.path.length < 2) {
      return false
    }
    if (this.path[0].card.species === this.end().card.species) {
      return true
    } else {
      return false
    }
  }

  score() {
    // base score
    let score = this.path.length
    // add same species multiplier
    let species = new Set(this.path.map(s => s.card.species))
    if (this.path.length >= 4 && species.size == 1) {
      score *= 2
    }
    // add 1 bonus
    if (this.path[0].card.value === 1) {
      score += 1
    }
    // add 8 bonus
    if (this.end().card.value === 8) {
      score += 2
    }
    return score
  }

  serialize() {
    return {
      "stones": this.stones.map(p => p.serialize())
    }
  }
}

export class Scorer {
  static scoreSpecies(sanctuary, species) {
    let pathsToEval = sanctuary.stones.filter(s => s.card.species === species && s.card.value <= 7).map(s => new ScorePath({"path": [s]}))
    let score = 0
    while (pathsToEval.length > 0) {
      let path = pathsToEval.pop()
      if (path.canScore()) {
        let pathScore = path.score()
        if (pathScore > score) {
          score = pathScore
        }
      }
      let currentNode = path.end()
      if (sanctuary.hasStone(currentNode.position.left())) {
        let stone = sanctuary.getStone(currentNode.position.left())
        if (path.canAdd(stone)) {
          pathsToEval.push(path.add(stone))
        }
      }
      if (sanctuary.hasStone(currentNode.position.right())) {
        let stone = sanctuary.getStone(currentNode.position.right())
        if (path.canAdd(stone)) {
          pathsToEval.push(path.add(stone))
        }
      }
      if (sanctuary.hasStone(currentNode.position.top())) {
        let stone = sanctuary.getStone(currentNode.position.top())
        if (path.canAdd(stone)) {
          pathsToEval.push(path.add(stone))
        }
      }
      if (sanctuary.hasStone(currentNode.position.bottom())) {
        let stone = sanctuary.getStone(currentNode.position.bottom())
        if (path.canAdd(stone)) {
          pathsToEval.push(path.add(stone))
        }
      }
    }
    return score
  }
}

export class Stone {
  constructor(json) {
    this.position = new Position(json.position);
    this.card = new Card(json.card);
  }

  serialize() {
    return {
      "position": this.position.serialize(),
      "card": this.card.serialize()
    }
  }
}

export class Position {
  constructor(json) {
    this.x = json.x;
    this.y = json.y;
  }

  left() {
    return new Position({"x": this.x-1, "y": this.y});
  }

  right() {
    return new Position({"x": this.x+1, "y": this.y});
  }

  top() {
    return new Position({"x": this.x, "y": this.y+1});
  }

  bottom() {
    return new Position({"x": this.x, "y": this.y-1});
  }

  isAdjacent(position) {
    if (this.right().equals(position) ||
        this.left().equals(position) ||
        this.top().equals(position) ||
        this.bottom().equals(position)) {
      return true
    } else {
      return false
    }
  }

  static center() {
    return new Position({"x": 0, "y": 0})
  }

  str() {
    return `${this.x},${this.y}`
  }

  equals(that) {
    if (this.x === that.x && this.y === that.y) {
      return true
    }
  }

  serialize() {
    return {
      "x": this.x,
      "y": this.y,
    }
  }
}

export class Card {
  constructor(json) {
    this.species = json.species;
    this.value = json.value;
  }

  serialize() {
    return {
      "species": this.species,
      "value": this.value,
    }
  }
}

export class GameState {
  constructor(json) {
    if (json) {
      this.players = json["players"].map(p => new Player(p));
      this.deck = json["deck"].map(c => new Card(c));
      this.turn = json["turn"];
    } else {
      this.players = [];
      this.deck = [];
      this.turn = "";
    }
  }

  static createNewGame(player_names) {
    let gs = new GameState();
    for (let i = 1; i <= 8; i++) {
      for (let species of Species) {
        gs.deck.push(new Card({"species": species, "value": i}));
      }
    }
    gs.deck = shuffle(gs.deck);
    let players = [];
    for (let name of player_names) {
      let player = new Player();
      player.username = name;
      gs.players.push(player);
    }    

    for (let name of player_names) {
      gs.turn = name;
      for (let i = 0; i < 7; i++) {
        gs.drawCard();
      }
    }
    gs.turn = player_names[0];
    return gs;
  }
  
  serialize() {
    return {
      "players": this.players.map(p => p.serialize()),
      "turn": this.turn,
      "deck": this.deck.map(c => c.serialize())
    };
  }

  getPlayer(username) {
    for (let player of this.players) {
      if (player.username == username) {
        return player;
      }
    }
    throw "Could not find player";
  }

  drawDiscard(user) {
    let player = this.getPlayer(user);
    if (!player.discard) {
      throw "Invalid move. Discard empty";
    }
    let currPlayer = this.getPlayer(this.turn);
    currPlayer.hand.unshift(player.discard.shift());
  }

  drawCard() {
    let player = this.getPlayer(this.turn);
    if (player.hand.length >= 9) {
      throw "Invalid move. Must have less than 9 cards";
    }
    assertValidGameState(this.deck.length > 0);
    player.hand.push(this.deck.shift());
  }

  drawDiscard(player_name) {
    let player = this.getPlayer(player_name);
    assertValidGameState(player.discard.length > 0);

    let currentPlayer = this.getPlayer(this.turn);
    currentPlayer.hand.push(player.discard.pop());
  }

  playCard(card, position) {
    // todo, validate move.
    let player = this.getPlayer(this.turn);
    player.sanctuary.addStone(position, card);
    let index = player.hand.indexOf(card);
    if(index !== -1) {
      player.hand.splice(index, 1);
    }
  }

  discard(card) {
     // todo, validate move.
     let player = this.getPlayer(this.turn);
     let index = player.hand.indexOf(card);
     if(index !== -1) {
       player.hand.splice(index, 1);
     }
     player.discard.push(card);
  }

  rightToScore(species) {
    let scoreEight = true;
    for (let player of this.players) {
      if (player.hand.filter(c => (c.value === 1 && c.species === species)).length === 1) {
        scoreEight = false;
      }
    }
    
    let maxScore = 0
    let scoringPlayers = []
    for (let player of this.players) {
      // let playerScore = player.hand.reduce((score, v) => {
      //   if (v.species === species) {
      //     if (v.value < 8 || score8) {
      //       score += v.value
      //     }
      //   }
      // })
      let playerHand = player.hand.filter(c => c.species === species).map(c => c.value);
      let playerScore = 0
      if (playerHand.length > 0) {
        playerScore = playerHand.reduce((score, v) => {
          if (v < 8 || scoreEight) {
            return score + v
          }
        })
      }
      if (playerScore == maxScore) {
        scoringPlayers.push(player)
      }
      if (playerScore > maxScore) {
        maxScore = playerScore;
        scoringPlayers = [player];
      }
    }
    return scoringPlayers
  }

  endTurn() {
    let curr_index = 0;
    for (let idx =0; idx < this.players.length; idx++) {
      if (this.players[idx].username == this.turn) {
        curr_index = idx;
      }
    }
    console.log(curr_index);
    let new_idx = (curr_index + 1) % this.players.length;
    console.log(new_idx);
    let next_player = this.players[new_idx].username
    this.turn = next_player;
    console.log("new player " + this.turn);
    this.validateEndOfTurn();
  }

  validateEndOfTurn() {    
    for (let player of this.players) {
      assertValidGameState(player.hand.length == 7);
    }
  }

  // scoring
}
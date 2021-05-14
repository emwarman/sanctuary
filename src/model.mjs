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
      this.arboretum = new Arboretum(json["arboretum"]);
      this.discard = json["discard"].map(c => new Card(c));
    } else {
      this.username = "";
      this.hand = [];
      this.arboretum = new Arboretum([]);
      this.discard = [];
    }
  }

  serialize() {
    return {
      "name": this.username,
      "hand": this.hand.map(c => c.serialize),
      "arboretum": this.arboretum.serialize(),
      "discard": this.discard.map(c => c.serialize),
    }
  }
}

export class Arboretum {
  constructor(json_list) {
    this.positions = json_list.map(c => c.position)
    this.cards = json_list.map(c => new Card(c.card))
  }

  validate() {
    // todo..
  }

  serialize() {
    let list = [];
    console.log(this.cards[0]);
    for (let i = 0; i < this.positions.length; i++) {
      list.push({
        "position": this.positions[i],
        "card": this.cards[i].serialize(),
      });
    }
    return list;
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

  playCard(card, position) {
    // todo, validate move.
    let player = this.getPlayer(this.turn);
    player.arboretum.positions.push(position);
    player.arboretum.cards.push(card);
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

  validateEndOfTurn() {    
    for (let player in this.players) {
      assertValidGameState(player.hand.length == 7);
      player.arboretum.validate();
    }
  }

  // scoring
}
function Player(id, money){
  return {
    id: id,
    money: money,
    cards: []
  };
}

let GameStates = {
  New: 0,
  PreFlop: 1,
  Flop: 2,
  River: 3,
  Turn: 4,
  End: 5
};

const MAX_PLAYERS = 4;
class Game{
  constructor(){
    this.players = [];
    this.selectedCards = [];
    this.cards = [
      'Ace Of Clubs',
      'King Of Clubs',
      'Queen Of Clubs',
      'Jack Of Clubs',
      'Ten Of Clubs',
      'Nine Of Clubs',
      'Eight Of Clubs',
      'Seven Of Clubs',
      'Six Of Clubs',
      'Five Of Clubs',
      'Four Of Clubs',
      'Three Of Clubs',
      'Two Of Clubs',

      'Ace Of Spades',
      'King Of Spades',
      'Queen Of Spades',
      'Jack Of Spades',
      'Ten Of Spades',
      'Nine Of Spades',
      'Eight Of Spades',
      'Seven Of Spades',
      'Six Of Spades',
      'Five Of Spades',
      'Four Of Spades',
      'Three Of Spades',
      'Two Of Spades',


      'Ace Of Diamonds',
      'King Of Diamonds',
      'Queen Of Diamonds',
      'Jack Of Diamonds',
      'Ten Of Diamonds',
      'Nine Of Diamonds',
      'Eight Of Diamonds',
      'Seven Of Diamonds',
      'Six Of Diamonds',
      'Five Of Diamonds',
      'Four Of Diamonds',
      'Three Of Diamonds',
      'Two Of Diamonds',


      'Ace Of Hearts',
      'King Of Hearts',
      'Queen Of Hearts',
      'Jack Of Hearts',
      'Ten Of Hearts',
      'Nine Of Hearts',
      'Eight Of Hearts',
      'Seven Of Hearts',
      'Six Of Hearts',
      'Five Of Hearts',
      'Four Of Hearts',
      'Three Of Hearts',
      'Two Of Hearts',
    ]
    this.gameState = GameStates.New;
  }
  newPlayer(money){
    if(this.players.length >= MAX_PLAYERS){
      return undefined;
    }
    let player = Player(this.players.length + 1, money);
    this.players.push(player);
    return player;
  }
  getPlayer(id){
    if(id > 4 || id < 1 || id > this.players.length){
      return undefined;
    }
    else{
      return this.players[id - 1];
    }
  }
  reset(){
    this.players = [];
    this.selectedCards = [];
  }
  getRndCard(){
    if(this.selectedCards.length == 52){
      return undefined;
    }
    else{
      let choice = Math.floor(Math.random() * 52) + 1;
      while (this.selectedCards.includes(choice)){
        choice = Math.floor(Math.random() * 52) + 1;
      }
      this.selectedCards.push(choice);
      return this.cards[choice];
    }
  }
  dealHands(){
    this.players.forEach(player => {
      // card 1
      let card = this.getRndCard();
      player.cards.push(card);
      // card 2
      card = this.getRndCard();
      player.cards.push(card);
    });
  }
  advanceGame() {
    switch (this.gameState) {
      case GameStates.New:
        this.gameState = GameStates.PreFlop;
        // deal the hands then take the blinds
        break;
      case GameStates.PreFlop:
        this.gameState = GameStates.Flop;
        // take the bids then deal the flop
        break;
      case GameStates.Flop:
        this.gameState = GameStates.River;
        // take the bids then deal the river
        break;
      case GameStates.River:
        this.gameState = GameStates.Turn;
        // take the bids then deal the turn
        break;
      case GameStates.Turn:
        this.gameState = GameStates.End;
        // take the bids
        break;
      case GameStates.End:
        this.gameState = GameStates.New;
        // determin winner then reset the game
        break;
      default:

    }
  }
}


module.exports = {Game, Player, GameStates};

function Player(id, money){
  return {
    id: id,
    money: money,
    cards: [],
    currentBet: 0
  };
}

const GameStates = {
  New: 0,
  PreFlop: 1,
  Flop: 2,
  River: 3,
  End: 4,
};

const Actions = {
  Fold: 0,
  Call: 1,
  Raise: 2,
  Check: 3,

}

const MAX_PLAYERS = 4;
const MAX_RAISES = 3;
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
    this.pot = 0;
    this.blindPlayers = [];
    this.minBets = [1, 2];
    this.minBet = this.minBets[1];
    this.currentPosition = 0;
    this.hasFolded = []
    this.hasBet = false;
    this.counts = {
      raise: 0,
      check: 0,
      call: 0
    }
    this.winner = 0;

    this.reset = this.reset.bind();
  }

  startGame(){
    this.reset();
    this.procesState();
  }

  newPlayer(money){
    if(this.players.length >= MAX_PLAYERS || this.gameState != GameStates.New){
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
    this.gameState = GameStates.New;
    this.players = [];
    this.selectedCards = [];
    this.blindPlayers = [];
    this.pot = 0;
    this.minBet = this.minBets[1];
    this.currentPosition = 1;
    this.hasFolded = []
    this.hasBet = false;
    this.counts = {
      raise: 0,
      check: 0,
      call: 0
    }
    this.winner = 0;
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
  dealCards(ammount) {
    let cards = [];
    for(let i = 0; i < ammount; i++){
      let card = this.getRndCard();
      cards.push(card);
    }
    return cards;
  }
  procesState() {
    switch (this.gameState) {
      case GameStates.New:
        // take the blinds then deal the hands then take bets

        // determin the blind players
        const numPlayers = players.length;
        const id1 = Math.floor(Math.random() * numPlayers) + 1;
        const id2 = id1 == 4 ? 1 : id1 + 1;
        this.blindPlayers.push(id1);
        this.blindPlayers.push(id2);
        // take the blinds
        this.makeBet(id1, this.minBets[0]);
        this.makeBet(id2, this.minBets[1]);

        // deal the hands the pre flop
        this.dealHands();

        // taking bets starting after the blind players
        const id3 = id2 == 4 ? 1 : id2 + 1;
        this.currentPosition = id3;
        break;
      case GameStates.PreFlop:
        // deal the flop then take bets for the flop

        // deals the flop
        this.dealCards(3);
        this.currentPosition = 1;
        break;
      case GameStates.Flop:
        // deal the river then take bets for the river

        // deals the reiver
        this.dealCards(1);
        this.currentPosition = 1;
        break;
      case GameStates.River:
        // deal the turn then take bets for the turn

        // deals the turn
        this.dealCards(1);
        this.currentPosition = 1;
        break;
      case GameStates.End:
        // determin winner then reset the game
        setInterval(this.reset, 5000);
        break;
    }
  }

  makeBet(id, bet){
    let p = this.getPlayer(id);
    if(p == undefined){
      return 0;
    }
    else if(p.money < bet){
      return 1;
    }
    else{
      p.money -= bet;
      this.pot += bet;
      p.currentBet += bet;
      return p;
    }
  }
  getActions(id){
    const p = this.getPlayer(id);
    let actions = [Actions.Fold];
    if(p.money > this.minBet && this.counts.raise < MAX_RAISES){
      actions.push(Actions.Raise);
    }
    switch (this.gameState) {
      case GameStates.New:
        break;
      case  GameStates.PreFlop:
        if(this.blindPlayers[1] == id){
          actions.push(Actions.Check);
        }
        else if(p.money >= this.minBet){
          actions.push(Actions.Call);
        }
        break;
      case  GameStates.Flop:
      case  GameStates.River:
      case  GameStates.Turn:
        if(!this.hasBet){
          actions.push(Actions.Check);
        }
        else if(p.money >= this.minBet){
          actions.push(Actions.Call);
        }
        break;
      case  GameStates.End:
        break;
    }
  }
  performAction(id, action, bet){
    switch (action) {
      case Actions.Fold:
        this.hasFolded.push(id);
        break;
      case Actions.Call:
        const p = this.getPlayer(id);
        this.makeBet(id, this.minBet - p.currentBet);
        this.hasBet = true;
        this.counts.call += 1;
        break;
      case Action.Raise:
        this.makeBet(id, bet);
        this.minBet = bet;
        this.hasBet = true;
        this.counts.raise += 1;
        break;
      case Actions.Check:
      this.counts.check += 1;
        break;
    }
    const playerCount = this.players.length;
    const inPlay = playerCount - this.hasFolded.length;
    if(this.hasFolded.length == playerCount - 1){
      // all but one have foled game over
      let winner = 0;
      for(let i = 0; i < playerCount; i++){
        winner += i + 1;
      }
      for(let i = 0; i < this.hasFolded.length; i++){
        winner -= this.hasFolded[i];
      }
      this.winner = winner;
      return;
    }

    if(this.counts.check == inPlay){
      // all players have checked this turn is over
      this.advanceTurn();
    }
    if(this.counts.call == inPlay){
      // all players have matched the bet this turn is over
      this.advanceTurn();
    }

    do {
      this.currentPosition += 1;
      if(currentPosition == 5){
        this.currentPosition = 1;
      }
    }
    // if has folded then add again
    while(this.hasFolded.includes(this.currentPosition));
  }

  advanceTurn(){
    this.gameState += 1;
    this.currentPosition = 0;
    this.hasBet = false;
    this.counts = {
      raise: 0,
      check: 0,
      call: 0
    }
    this.players.forEach((item, i) => {
      item.currentBet = 0;
    });
    this.procesState();
  }
}

module.exports = {Game, Player, GameStates};

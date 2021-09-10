const {Game, Player} = require('./Game')
// import {Game, Player, GameStates} from 'Game'
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;

let game = new Game();

let players = [];

app.use(express.json())
app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res) {
  res.json(req.body);
});

app.get('/get', function(req, res) {
  res.json(game.players);
});

app.get('/pot', function(req, res) {
  res.json(game.pot);
});

app.get('/cards/:id', function(req, res){
  const p = game.getPlayer(req.params.id);
  if(p == undefined){
    res.status(404).send("Id not found");
  }
  else{
    res.status(200).json(p);
  }
});

app.post('/create', function(req, res) {
  const p = game.newPlayer(req.body.money);
  if(p == undefined) {
    res.status(409).send('Max players reached');
  }
  else {
    res.status(201).json(p);
  }
});

app.post('/bet', function(req, res){
  const p = game.makeBet(req.body.id, req.body.bet);
  if(p == 0){
    res.status(404).send('Player not found');
  }
  else if(p == 1){
    res.status(409).send('Unable to make bet');
  }
  else{
    res.status(201).json(p);
  }
});

app.put('/reset', function(req, res){
  game.reset();
  res.status(200).send('Game reset');
});

app.put('/start', function(req, res){
  game.dealHands();
  res.status(200).json(game.players);
});

app.get('/position', function(req, res){
  res.status(200).json(game.currentPosition);
});

app.listen(port, () => {
  console.log(`Poker server listening on port ${port}!`)
});

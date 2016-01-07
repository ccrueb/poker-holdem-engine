
'use strict';

process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const storage = require('../storage');
let saveStub = sinon.stub(storage, 'save');


//
// browserify, and winston do not play well together...
// setup the winston object as if it was really here.
const winston = require('winston');
winston.loggers = { add: function(){}, get: function() { return { info: function() {}, error: function() {} }; } };
winston.transports = { File: function() {} };

const dealer = require('../holdem-game-loop');

const sut = require('../index');

const tape = require('tape');
const chalk = require('chalk');

tape('game:* listeners', t => t.end());

tape('game:start listener', function(t) {

  let dealerStub = sinon.stub(dealer.prototype, 'next');

  sut.gamestate.emit('game:start', { players: [
    { name: 'Bluffers', members: [{ githubUsername: 'pok-bluffers' }] },
    { name: 'PStar', members: [{ githubUsername: 'starrr' }] }
  ] });

  t.equal(sut.gamestate.status, 'play', 'listen game:start event');
  t.equal(sut.gamestate.players.length, 2, 'players registered');
  t.equal(sut.gamestate.players[0].name, 'Bluffers', 'players data is correct');

  dealerStub.restore();

  t.end();

});

tape('game:pause listener', function(t) {

  sut.gamestate.emit('game:pause', { players: [] });

  t.equal(sut.gamestate.status, 'pause', 'listen game:pause event');
  t.end();

});

tape('game:end listener', function(t) {

  sut.gamestate.emit('game:end', { players: [] });

  t.equal(sut.gamestate.status, 'stop', 'listen game:end event');
  t.end();

});

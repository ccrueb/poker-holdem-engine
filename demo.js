
'use strict';

process.env.NODE_ENV = 'demo';


const exec = require('child_process').exec;

const chalk = require('chalk');
const mongoose = require('mongoose');

const gameSchema = require('./demo-game-schema');
const chartSchema = require('./demo-chart-schema');

const engine = require('./index');
const router = require('./router');
var MatchMaker = require('./matchMaker');

function connect(connectionString) {
  return new Promise(function (res, rej) {
    mongoose.connect(connectionString);
    mongoose.connection.on('error', function (err) {
      console.log(chalk.bold.red('Thread cant connect to mongo:'), err.message);
      console.log(chalk.bold.red('>'));
      rej(err);
    });
    mongoose.connection.once('open', function () {
      res();
    });
  })
}


connect('mongodb://localhost:27017/store')
  .then(function () {

    console.log(chalk.bold.green('Connected to mongoDB'));


    const Game = mongoose.model('game', gameSchema);

    function saveUpdates(data, done) {
      [, data.tournamentId, data.gameId, data.handId] = data.handId.match(/^[\d]+_([a-z,-\d]+)_([\d]+)-([\d]+)$/i);
      let entry = new Game(data);
      entry.save(function (err, savedData) {
        if (err) {
          console.log(chalk.bold.red(`An error occurred while saving ${data.type} updates.`));
          console.log(err.message);
        }
        done();
      });
    }


    const Chart = mongoose.model('chart', chartSchema);

    function saveChart(data, done) {
      let entry = new Chart(data);
      entry.save(function (err, savedData) {
        if (err) {
          console.log(chalk.bold.red(`An error occurred while saving ${data.type} updates.`));
          console.log(err.message);
        }
        done();
      });
    }



    engine.on('tournament:aborted', function () {
      console.log(chalk.bold.red('Tournament aborted.'));
    });

    engine.on('tournament:completed', function () {
      console.log(chalk.bold.gray('Tournament completed.'));
    });

    engine.on('gamestate:updated', function (data, done) {
      if (data.type != 'points')
        return void saveUpdates(data, done);

      saveChart(data, done);
    });

   
    //Start router
    router.start(engine, new MatchMaker(engine));

    //Put 3 demo players on seperate processes that send requests to port 9000
    for (var i = 0; i < 3; i++) {
      const child = exec('node ./index.js', { cwd: `./demo-players/external/`}, function (err, stdout, stderr) {
        if (err) {
          console.log(chalk.bold.red('An error occurred while trying to open child process'), err);
        }
      });
      child.stdout.on('data', data => console.log(chalk.bold.gray(`${player.name}'s stdout:`), data));
      child.stderr.on('data', data => console.log(chalk.bold.red(`${player.name}'s stderr:`), data));
    };
  });
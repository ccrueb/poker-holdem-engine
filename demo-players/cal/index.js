'use strict';

const player = require('./player');

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();
const server = http.Server(app);
const port = Number.parseInt(process.env.PORT);

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.status(200).send('200 OK');
});

app.get('/version', function(req, res) {
  res.status(200).send(player.VERSION);
});

app.post('/bet', function(req, res) {
    setTimeout(function () {
        res.status(200).send(player.bet(req.body).toString());
    },3000);
  
});

app.get('/update', function (req, res) {
    res.status(200).send(player.getMostRecentGs());
});




server.listen(port, function() {
  console.log('Server listening on port', server.address().port);
});

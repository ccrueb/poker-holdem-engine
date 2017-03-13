
'use strict';

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();
const server = http.Server(app);
const port = 9000;


exports = module.exports = {
    start: function (engine) {
        app.use(bodyParser.json());

        app.get('/game/:gameId/:playerId', function (req, res) {
            console.log('in router');
            engine.addRequest(req, res, req.params.gameId, req.params.playerId)
        });

        app.get('/version', function (req, res) {
            res.status(200).send(player.VERSION);
        });

        app.post('/bet', function (req, res) {
            res.status(200).send(player.bet(req.body).toString());
        });
        server.listen(port, function () {
            console.log('Server listening on port', server.address().port);
        });
    }
}





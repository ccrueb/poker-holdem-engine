function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

var id = getRandomArbitrary(0, 100000);

var gameId;

var request = require('request');
//This is an external player that long polls server and calls every hand
request('http://127.0.0.1:9000/join/' + id, function (error, response, body) {
  if(!error) {
      gameId = body;

      //Wait 3 seconds before playing
      setTimeout(function () {
         play(); 
      }, 3000)
      
  }
});
// Make request to join game

// Play game - call/fold every hand
var play = function() {

    console.log("requesting game state");
    request('http://127.0.0.1:9000/game/' + gameId + '/' + id, function (error, response, body) {
  if(!error) {
    console.log("game state received");
      
      play();
  }
    })
}




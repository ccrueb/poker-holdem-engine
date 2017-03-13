exports = module.exports = {

  VERSION: 'cal folder',

  gs: undefined,


  bet: function (gamestate) {

    'use strict';
    this.gs = gamestate;
    // console.log(`Hello my name is ${gamestate.players[gamestate.me].name}!`);
    console.log(gamestate);

    return 0;

  },

  getMostRecentGs: function () {
      return this.gs;
  }

};
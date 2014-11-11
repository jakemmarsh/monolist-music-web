'use strict';

module.exports = function(db) {

  var exports = {};

  exports.trackComment  = require('./trackComment')(db);
  exports.playlist      = require('./playlist')(db);
  exports.tag           = require('./tag')(db);
  exports.play          = require('./play')(db);
  exports.like          = require('./like')(db);
  exports.upvote        = require('./upvote')(db);
  exports.downvote      = require('./downvote')(db);
  exports.track         = require('./track')(db);
  exports.user          = require('./user')(db);

  return exports;

};
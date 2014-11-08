'use strict';

module.exports = function(db) {

  var exports = {};

  exports.comment  = require('./comment')(db);
  exports.playlist = require('./playlist')(db);
  exports.tag      = require('./tag')(db);
  exports.play     = require('./play')(db);
  exports.like     = require('./like')(db);
  exports.track    = require('./track')(db);
  exports.user     = require('./user')(db);

  return exports;

};
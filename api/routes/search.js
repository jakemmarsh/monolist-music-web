'use strict';

module.exports = function(req, res) {
  res.status(200).send('Searching for: ' + req.params.query);
};
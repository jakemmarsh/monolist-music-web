'use strict';

module.exports = function(req, res) {

  // Search all resources. Bandcamp, Spotify, Soundcloud, etc.

  res.status(200).send('Searching for: ' + req.params.query);

};
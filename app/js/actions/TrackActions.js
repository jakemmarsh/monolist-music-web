'use strict';

var Reflux = require('reflux');

var TrackActions = Reflux.createActions([

  'select',
  'upvote',
  'downvote',
  'addComment'

]);

module.exports = TrackActions;
'use strict';

var Reflux = require('reflux');

var TrackActions = Reflux.createActions([

  'select',
  'upvote',
  'downvote',
  'addComment',
  'removeComment'

]);

module.exports = TrackActions;
'use strict';

var Reflux = require('reflux');

var TrackActions = Reflux.createActions([

  'select',
  'star',
  'upvote',
  'downvote',
  'addComment',
  'removeComment'

]);

module.exports = TrackActions;
'use strict';

import Reflux from 'reflux';

var TrackActions = Reflux.createActions([

  'select',
  'star',
  'unstar',
  'upvote',
  'downvote',
  'addComment',
  'removeComment'

]);

export default TrackActions;
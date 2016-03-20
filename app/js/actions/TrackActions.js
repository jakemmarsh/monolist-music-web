'use strict';

import Reflux from 'reflux';

const TrackActions = Reflux.createActions([

  'select',
  'star',
  'unstar',
  'upvote',
  'downvote',
  'addComment',
  'removeComment'

]);

export default TrackActions;

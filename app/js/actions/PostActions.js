'use strict';

import Reflux from 'reflux';

var PostActions = Reflux.createActions([

  'create',
  'open',
  'like',
  'addComment',
  'removeComment',
  'delete'

]);

export default PostActions;
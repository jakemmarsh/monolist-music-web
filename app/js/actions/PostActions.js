'use strict';

import Reflux from 'reflux';

var PostActions = Reflux.createActions([

  'create',
  'like',
  'addComment',
  'removeComment',
  'delete'

]);

export default PostActions;
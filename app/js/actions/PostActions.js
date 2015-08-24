'use strict';

import Reflux from 'reflux';

var PostActions = Reflux.createActions([

  'createGlobalPost',
  'createGroupPost',
  'like',
  'addComment',
  'removeComment',
  'delete'

]);

export default PostActions;
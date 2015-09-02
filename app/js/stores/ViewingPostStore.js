'use strict';

import Reflux      from 'reflux';

import PostActions from '../actions/PostActions';
import PostAPI     from '../utils/PostAPI';

const ViewingPostStore = Reflux.createStore({

  init() {
    this.post = null;

    this.listenTo(PostActions.open, this.loadPost);
  },

  loadPlaylist(postId, cb = function() {}) {
    PostAPI.get(postId).then(post => {
      console.log('loaded post:', post);
      this.post = post;
      cb(null, this.post);
      this.trigger(null, this.post);
    }).catch(err => {
      cb(err);
      this.trigger(err);
    });
  }

  // TODO: how to handle comments and deletion separately from ViewingPostListStore?

});

export default ViewingPostStore;
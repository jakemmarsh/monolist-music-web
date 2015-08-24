'use strict';

import Reflux        from 'reflux';

import GlobalActions from '../actions/GlobalActions';
import PostActions   from '../actions/PostActions';
import PostAPI       from '../utils/PostAPI';
import PlaylistAPI   from '../utils/PlaylistAPI';

var ExploreStore = Reflux.createStore({

  init() {
    this.data = {
      posts: [],
      searches: []
    };

    this.listenTo(GlobalActions.loadExplorePage, this.loadData);
    this.listenTo(PostActions.createGlobalPost, this.createPost);
  },

  loadData(cb = function(){}) {
    console.log('load explore data');

    PostAPI.getNewest().then(posts => {
      this.data.posts = posts || [];
      PlaylistAPI.getRecentSearches().then(searches => {
        this.data.searches = searches || [];
        cb(null, this.data);
        this.trigger(null, this.data);
      });
    }).catch(err => {
      cb(err);
      this.trigger(err);
    });
  },

  createPost(post, cb = function(){}) {
    console.log('create global post');

    PostAPI.create(post).then(createdPost => {
      cb(null, createdPost);
    }).catch(err => {
      cb(err);
    });
    cb();
  }

});

export default ExploreStore;
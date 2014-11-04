'use strict';

var Q        = require('q');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var UserAPI = {

  get: function(username) {
    var deferred = Q.defer();

    // request.get(APIUtils.API_ROOT + 'user/' + username).end(function(res) {
    //   if ( !res.ok ) {
    //     deferred.reject(res.text);
    //   } else {
    //     deferred.resolve(APIUtils.normalizeResponse(res));
    //   }
    // });

    deferred.resolve({
      username: 'jakemmarsh',
      displayName: 'Jake Marsh',
      playlists: [
        {
          id: 1,
          title: 'My Rap Playlist',
          tags: ['Rap', 'Hip-Hop', 'Party'],
          image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
          likes: 34,
          plays: 923
        },
        {
          id: 1,
          title: 'My Rap Playlist',
          tags: ['Rap', 'Hip-Hop', 'Party'],
          image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
          likes: 34,
          plays: 923
        },
        {
          id: 1,
          title: 'My Rap Playlist',
          tags: ['Rap', 'Hip-Hop', 'Party'],
          image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
          likes: 34,
          plays: 923
        },
        {
          id: 1,
          title: 'My Rap Playlist',
          tags: ['Rap', 'Hip-Hop', 'Party'],
          image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
          likes: 34,
          plays: 923
        },
        {
          id: 1,
          title: 'My Rap Playlist',
          tags: ['Rap', 'Hip-Hop', 'Party'],
          image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
          likes: 34,
          plays: 923
        },
        {
          id: 1,
          title: 'My Rap Playlist',
          tags: ['Rap', 'Hip-Hop', 'Party'],
          image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
          likes: 34,
          plays: 923
        }
      ]
    });

    return deferred.promise;
  },

  getCollaborations: function(userId) {
    var deferred = Q.defer();

    // request.get(APIUtils.API_ROOT + 'user/' + userId + '/playlists').end(function(res) {
    //   if ( !res.ok ) {
    //     deferred.reject(res.text);
    //   } else {
    //     deferred.resolve(res);
    //   }
    // });

    deferred.resolve([
      {
        id: 1,
        title: 'My Rap Playlist',
        tags: ['Rap', 'Hip-Hop', 'Party'],
        image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
        likes: 34,
        plays: 923
      },
      {
        id: 1,
        title: 'My Rap Playlist',
        tags: ['Rap', 'Hip-Hop', 'Party'],
        image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
        likes: 34,
        plays: 923
      },
      {
        id: 1,
        title: 'My Rap Playlist',
        tags: ['Rap', 'Hip-Hop', 'Party'],
        image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
        likes: 34,
        plays: 923
      },
      {
        id: 1,
        title: 'My Rap Playlist',
        tags: ['Rap', 'Hip-Hop', 'Party'],
        image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
        likes: 34,
        plays: 923
      },
      {
        id: 1,
        title: 'My Rap Playlist',
        tags: ['Rap', 'Hip-Hop', 'Party'],
        image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
        likes: 34,
        plays: 923
      },
      {
        id: 1,
        title: 'My Rap Playlist',
        tags: ['Rap', 'Hip-Hop', 'Party'],
        image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
        likes: 34,
        plays: 923
      }
    ]);

    return deferred.promise;
  },

  login: function(username, password) {
    var deferred = Q.defer();
    var loginData = {
      username: username,
      password: password
    };

    // request.post(APIUtils.API_ROOT + 'login', loginData).end(function(res) {
    //   if ( !res.ok ) {
    //     deferred.reject(res.text);
    //   } else {
    //     deferred.resolve(APIUtils.normalizeResponse(res));
    //   }
    // });

    deferred.resolve({
      id: 1
    });

    return deferred.promise;
  }

};

module.exports = UserAPI;
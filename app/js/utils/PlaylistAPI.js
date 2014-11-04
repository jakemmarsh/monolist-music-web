'use strict';

var Q        = require('q');
var request  = require('superagent');

var APIUtils = require('./APIUtils');

var PlaylistAPI = {

  get: function(id) {
    var deferred = Q.defer();

    // request.get(APIUtils.API_ROOT + 'playlist/' + id).end(function(res) {
    //   if ( !res.ok ) {
    //     deferred.reject(res.text);
    //   } else {
    //     deferred.resolve(APIUtils.normalizeResponse(res));
    //   }
    // });

    deferred.resolve({
      privacy: 'public',
      userIsCollaborator: true,
      creator: 1,
      title: 'My Rap Playlist',
      tags: ['Rap', 'Hip-Hop', 'Party'],
      image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
      likes: 34,
      plays: 923,
      tracks: [
        {
          title: 'Candler Road',
          artist: 'Childish Gambino',
          source: 'soundcloud',
          sourceParam: '164497989',
          image: 'https://i1.sndcdn.com/artworks-000064028350-zpvcu0-large.jpg?e76cf77',
          id: 0
        },
        {
          title: 'Alright (ft. Big Sean)',
          artist: 'Logic',
          source: 'soundcloud',
          sourceParam: '146132553',
          image: 'https://i1.sndcdn.com/artworks-000077385297-oitifi-large.jpg?e76cf77',
          id: 1
        },
        {
          title: 'Jit/Juke',
          artist: 'Big Sean',
          source: 'soundcloud',
          sourceParam: '168793745',
          image: 'https://i1.sndcdn.com/artworks-000091744682-w6c1ym-large.jpg?e76cf77',
          id: 2
        },
        {
          title: 'Fight Night',
          artist: 'Migos',
          source: 'youtube',
          sourceParam: 'HsVnUpl2IKQ',
          image: 'https://i.ytimg.com/vi/HsVnUpl2IKQ/hqdefault.jpg',
          id: 3
        },
        {
          title: 'I',
          artist: 'Kendrick Lamar',
          source: 'youtube',
          sourceParam: 'hYIqaHWiW5M',
          image: 'https://i.ytimg.com/vi/hYIqaHWiW5M/hqdefault.jpg',
          id: 4
        }
      ]
    });

    return deferred.promise;
  },

  create: function(playlist) {
    var deferred = Q.defer();

    console.log('create:', playlist);

    return deferred.promise;
  },

  like: function(playlistId, userId) {
    var deferred = Q.defer();

    // request.put(APIUtils.API_ROOT + 'playlist/' + playlistId + '/like/' + userId).end(function(res) {
    //   if ( !res.ok ) {
    //     deferred.reject(res.text);
    //   } else {
    //     deferred.resolve(APIUtils.normalizeResponse(res));
    //   }
    // });

    deferred.resolve();

    return deferred.promise;
  },

  delete: function(playlistId, userId) {
    var deferred = Q.defer();

    // request.delete(APIUtils.API_ROOT + 'playlist/' + playlistId).end(function(res) {
    //   if ( !res.ok ) {
    //     deferred.reject(res.text);
    //   } else {
    //     deferred.resolve(APIUtils.normalizeResponse(res));
    //   }
    // });

    deferred.resolve();

    return deferred.promise;
  }

};

module.exports = PlaylistAPI;
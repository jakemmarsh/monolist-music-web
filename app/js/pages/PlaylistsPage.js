/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react');
var _            = require('underscore');

var PlaylistLink = require('../components/PlaylistLink');

var PlaylistsPage = React.createClass({

  propTypes: {
    updateHeader: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    selectTrack: React.PropTypes.func
  },

  getDefaultProps: function() {
    // TODO: get liked and participating playlists dynamically
    return {
      participatingPlaylists: [
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
      ],
      likedPlaylists: [
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
    };
  },

  componentDidMount: function() {
    this.props.updateHeader({
      title: 'Playlists',
      icon: 'fa-list'
    });
  },

  renderPlaylists: function(playlists) {
    var elements;

    elements = _.map(playlists, function(playlist, index) {
      return (
        <li key={index}>
          <PlaylistLink playlist={playlist} />
        </li>
      );
    });

    return elements;
  },

  render: function() {
    return (
      <section className="content playlists">

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-user"></i>
          </div>
          <h5 className="title">Participating Playlists</h5>
        </div>

        <ul className="playlist-list">
          {this.renderPlaylists(this.props.participatingPlaylists)}
        </ul>

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-heart"></i>
          </div>
          <h5 className="title">Liked Playlists</h5>
        </div>

        <ul className="playlist-list">
          {this.renderPlaylists(this.props.likedPlaylists)}
        </ul>

      </section>
    );
  }

});

module.exports = PlaylistsPage;
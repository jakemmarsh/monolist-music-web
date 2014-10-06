/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');

var Avatar       = require('../components/Avatar');
var PlaylistList = require('../components/PlaylistList');

var ProfilePage = React.createClass({

  propTypes: {
    updatePageTitle: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    selectTrack: React.PropTypes.func
  },

  getDefaultProps: function() {
    // TODO: don't hardcode user
    return {
      user: {
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
      }
    };
  },

  componentDidMount: function() {
    this.props.updatePageTitle(this.props.user.username);
  },

  renderUserPlaylists: function() {
    var element = null;

    if ( this.props.user.playlists && this.props.user.playlists.length ) {
      element = (
        <PlaylistList playlists={this.props.user.playlists} />
      );
    } else {
      element = (
        <h3 className="no-playlists">This user has not created any public playlists yet!</h3>
      );
    }

    return element;
  },

  renderUserStarredTracks: function() {
    var element = null;

    if ( this.props.user.starredTracks && this.props.user.starredTracks.length ) {
      // TODO: make this an actual list of tracks
      element = (
        <p>Starred Tracks</p>
      );
    } else {
      element = (
        <h4 className="no-starred-tracks">This user has not starred any tracks yet!</h4>
      );
    }

    return element;
  },

  render: function() {
    return (
      <section className="content profile">

        <div className="profile-header-container">
          <div className="avatar-container">
            <Avatar user={this.props.user} />
          </div>
          <div className="name-container">
            <h3 className="name">{this.props.user.displayName}</h3>
          </div>
          <div className="buttons-container"></div>
        </div>

        <div className="content-container">
          <div className="playlists-container">
            <div className="title-container">
              <div className="icon-container">
                <i className="fa fa-list"></i>
              </div>
              <h5 className="title">Playlists by {this.props.user.username}</h5>
            </div>
            {this.renderUserPlaylists()}
          </div>
          <div className="tracks-container">
            <div className="title-container">
              <div className="icon-container">
                <i className="fa fa-star"></i>
              </div>
              <h5 className="title">Starred</h5>
            </div>
            {this.renderUserStarredTracks()}
          </div>
        </div>

      </section>
    );
  }

});

module.exports = ProfilePage;
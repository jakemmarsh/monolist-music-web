/**
 * @jsx React.DOM
 */
'use strict';

var React               = require('react/addons');
var Reflux              = require('reflux');

var GlobalActions       = require('../actions/GlobalActions');
var ViewingProfileStore = require('../stores/ViewingProfileStore');
var Avatar              = require('../components/Avatar');
var PlaylistList        = require('../components/PlaylistList');

var ProfilePage = React.createClass({

  mixins: [Reflux.ListenerMixin],

  propTypes: {
    updatePageTitle: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      user: {}
    };
  },

  _onViewingProfileChange: function(user) {
    this.setState({
      user: user
    }, this.props.updatePageTitle(this.state.user.username));
  },

  componentWillMount: function() {
    GlobalActions.openUserProfile(this.props.params.username.toString(), this._onViewingProfileChange);
    this.listenTo(ViewingProfileStore, this._onViewingProfileChange);
  },

  renderUserPlaylists: function() {
    var element = null;

    if ( this.state.user.playlists && this.state.user.playlists.length ) {
      element = (
        <PlaylistList playlists={this.state.user.playlists} />
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

    if ( this.state.user.starredTracks && this.state.user.starredTracks.length ) {
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
            <Avatar user={this.state.user} />
          </div>
          <div className="name-container">
            <h3 className="name">{this.state.user.displayName}</h3>
          </div>
          <div className="buttons-container"></div>
        </div>

        <div className="content-container">
          <div className="playlists-container">
            <div className="title-container">
              <div className="icon-container">
                <i className="fa fa-list"></i>
              </div>
              <h5 className="title">Playlists by {this.state.user.username}</h5>
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

module.exports = React.createFactory(ProfilePage);
/**
 * @jsx React.DOM
 */
 'use strict';

var React = require('react/addons');
var Link  = require('react-router').Link;
var _     = require('underscore');

var CreateStoreMixin = require('../mixins/CreateStoreMixin');
var PlaylistStore    = require('../stores/PlaylistStore');
var Playlist         = require('../components/Playlist');

var cx               = React.addons.classSet;

var playlists = [
  {
    title: 'Example Playlist',
    id: 0
  },
  {
    title: 'My Rap Playlist',
    id: 1
  }
];

var PlaylistPage = React.createClass({

  mixins: [CreateStoreMixin([PlaylistStore])],

  getDefaultProps: function() {
    return {
      playlists: playlists
    };
  },

  getStateFromStore: function(props) {
    props = props || this.props;
    // var playlist = PlaylistStore.get(props.params.username);
    var playlist = {
      title: 'My Rap Playlist',
      privacy: 'public'
    };

    return {
      playlist: playlist
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getStateFromStore(nextProps));
  },

  componentDidMount: function() {
    this.props.updateHeader({
      title: this.state.playlist.title,
      icon: this.state.playlist.privacy === 'public' ? 'fa-globe' : 'fa-lock',
      onPlaylist: true
    });
  },

  renderPlaylistMenu: function() {
    var itemClasses;
    var listItems = _.map(this.props.playlists, function(playlist, index) {
      itemClasses = cx({
        'link': true,
        'active': parseInt(playlist.id) === parseInt(this.props.params.id)
      });

      return (
        <li className={itemClasses} key={index}>
          <Link to="playlist" params={{id: playlist.id}}>
            <div className="text-container">
              {playlist.title}
            </div>
          </Link>
        </li>
      );
    }.bind(this));

    return (
      <ul>
        {listItems}
      </ul>
    );
  },

  render: function() {
    return (
      <div className="table-wrapper">

        <nav className="sidebar left">
          <ul>
            <li className="link">
              <Link to="home">
                <div className="icon-container">
                  <i className="fa fa-compass"></i>
                </div>
                <div className="text-container">
                  Explore
                </div>
              </Link>
            </li>
            <li className="link active">
              <Link to="home">
                <div className="icon-container">
                  <i className="fa fa-list"></i>
                </div>
                <div className="text-container">
                  Playlists
                </div>
              </Link>
            </li>
          </ul>
        </nav>

        <section className="content">
          <Playlist tracks={this.props.playlist} selectTrack={this.props.selectTrack} currentTrack={this.props.currentTrack} />
          <h1>Bandcamp example:</h1>
          <audio controls="controls">
            Your browser does not support the <code>audio</code> element.
            <source src="/api/stream/bandcamp/http%3A%2F%2Fhopalong.bandcamp.com%2Ftrack%2Fsome-grace" />
          </audio>

          <hr />

          <h1>Youtube example:</h1>
          <audio controls="controls">
            Your browser does not support the <code>audio</code> element.
            <source src="/api/stream/youtube/JCZKC6x9zlU" />
          </audio>

          <hr />

          <h1>SoundCloud example:</h1>
          <audio controls="controls">
            Your browser does not support the <code>audio</code> element.
            <source src="/api/stream/soundcloud/116933280" />
          </audio>
        </section>

        <nav className="sidebar right">
          <div className="title-container">
            <h5 className="title">Playlists</h5>
            <div className="icon-container">
              <i className="fa fa-plus"></i>
            </div>
          </div>
          {this.renderPlaylistMenu()}
        </nav>

      </div>
    );
  }

});

module.exports = PlaylistPage;
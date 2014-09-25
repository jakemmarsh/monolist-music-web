/**
 * @jsx React.DOM
 */
 'use strict';

var React = require('react/addons');
var Link  = require('react-router').Link;
var _     = require('underscore');

var cx    = React.addons.classSet;

var PlaylistSidebar = React.createClass({

  getInitialState: function() {
    return {
      isCreatingNewPlaylist: false,
      newPlaylistName: ''
    };
  },

  createNewPlaylist: function() {
    this.setState({
      isCreatingNewPlaylist: true
    }, function() {
      this.refs.newPlaylistInput.getDOMNode().focus();
    });
  },

  clearNewPlaylist: function() {
    this.setState({
      isCreatingNewPlaylist: false,
      newPlaylistName: ''
    });
  },

  updateNewPlaylistName: function(evt) {
    this.setState({
      newPlaylistName: evt.target.value
    });
  },

  submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.saveNewPlaylist();
    }
  },

  saveNewPlaylist: function() {
    console.log('playlist saved');

    this.clearNewPlaylist();
  },

  renderPlaylistMenu: function() {
    var itemClasses;
    var listItems = _.map(this.props.playlists, function(playlist, index) {
      itemClasses = cx({
        'link': true,
        'active': parseInt(playlist.id) === parseInt(this.props.currentPlaylistId)
      });

      return (
        <Link to="playlist" params={{id: playlist.id}} key={index}>
          <li className={itemClasses} key={index}>
            <div className="text-container">
              {playlist.title}
            </div>
          </li>
        </Link>
      );
    }.bind(this));

    return (
      <ul>
        {listItems}
      </ul>
    );
  },

  renderNewPlaylistInput: function() {
    var element = null;

    if ( this.state.isCreatingNewPlaylist ) {
      element = (
        <div className="new-playlist-container">
          <input ref="newPlaylistInput"
                 type="text"
                 className="new-playlist"
                 value={this.state.newPlaylistName}
                 onKeyPress={this.submitOnEnter}
                 onChange={this.updateNewPlaylistName}
                 placeholder="New playlist name..." />
          <div className="icon-container">
            <i className="fa fa-remove" onClick={this.clearNewPlaylist}></i>
          </div>
        </div>
      );
    }

    return element;
  },

  render: function() {
    return (
      <div>
        <div className="title-container">
          <h5 className="title">Playlists</h5>
          <div className="icon-container">
            <i className="fa fa-plus" onClick={this.createNewPlaylist}></i>
          </div>
        </div>
        {this.renderPlaylistMenu()}
        {this.renderNewPlaylistInput()}
      </div>
    );
  }

});

module.exports = PlaylistSidebar;
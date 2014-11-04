/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react');

var PlaylistList = require('../components/PlaylistList');

var PlaylistsPage = React.createClass({

  propTypes: {
    userPlaylists: React.PropTypes.array.isRequired,
    updatePageTitle: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      userPlaylists: []
    };
  },

  componentDidMount: function() {
    this.props.updatePageTitle('Playlists');
  },


  render: function() {
    return (
      <section className="content playlists">

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-user"></i>
          </div>
          <h5 className="title">Collaborating Playlists</h5>
        </div>

        <PlaylistList playlists={this.props.userPlaylists} />

      </section>
    );
  }

});

module.exports = React.createFactory(PlaylistsPage);

// <div className="title-container">
//   <div className="icon-container">
//     <i className="fa fa-heart"></i>
//   </div>
//   <h5 className="title">Liked Playlists</h5>
// </div>

// <PlaylistList playlists={this.props.likedPlaylists} />
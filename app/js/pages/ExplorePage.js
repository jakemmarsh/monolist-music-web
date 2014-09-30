/**
 * @jsx React.DOM
 */
 'use strict';

var React            = require('react/addons');
var Link             = require('react-router').Link;

var PlaylistCarousel = require('../components/PlaylistCarousel');

var ExplorePage = React.createClass({

  propTypes: {
    updateHeader: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    selectTrack: React.PropTypes.func
  },

  componentDidMount: function() {
    this.props.updateHeader({
      title: 'Explore',
      icon: 'fa-compass'
    });
  },

  render: function() {
    return (
      <section className="content explore">

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-user"></i>
          </div>
          <h5 className="title">Trending Playlists</h5>
        </div>

        <PlaylistCarousel />

      </section>
    );
  }

});

module.exports = ExplorePage;
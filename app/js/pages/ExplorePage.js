/**
 * @jsx React.DOM
 */
 'use strict';

var React            = require('react/addons');

var PlaylistCarousel = require('../components/PlaylistCarousel');

var ExplorePage = React.createClass({

  propTypes: {
    updatePageTitle: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    selectTrack: React.PropTypes.func
  },

  componentDidMount: function() {
    this.props.updatePageTitle('Explore');
  },

  render: function() {
    return (
      <section className="content explore">

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-line-chart"></i>
          </div>
          <h5 className="title">Trending Playlists</h5>
        </div>

        <PlaylistCarousel />

      </section>
    );
  }

});

module.exports = React.createFactory(ExplorePage);
/**
 * @jsx React.DOM
 */
 'use strict';

var React            = require('react/addons');

var DocumentTitle    = require('../components/DocumentTitle');
var PlaylistCarousel = require('../components/PlaylistCarousel');

var ExplorePage = React.createClass({

  render: function() {
    return (
      <section className="content explore">

        <DocumentTitle title="Explore" />

      </section>
    );
  }

});

module.exports = React.createFactory(ExplorePage);

      // <section className="content explore">

      //   <DocumentTitle title="Explore" />

      //   <div className="title-container">
      //     <div className="icon-container">
      //       <i className="fa fa-line-chart"></i>
      //     </div>
      //     <h5 className="title">Trending Playlists</h5>
      //   </div>

      //   <PlaylistCarousel />

      // </section>
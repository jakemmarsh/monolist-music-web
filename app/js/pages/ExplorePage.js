/**
 * @jsx React.DOM
 */
 'use strict';

var React            = require('react/addons');
var Reflux           = require('reflux');

var GlobalActions    = require('../actions/GlobalActions');
var ExploreStore     = require('../stores/ExploreStore');
var DocumentTitle    = require('../components/DocumentTitle');
var PlaylistList     = require('../components/PlaylistList');

var ExplorePage = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState: function() {
    return {
      playlists: {
        trending: [],
        newnest: []
      },
      error: null
    };
  },

  _onExplorePlaylistsChange: function(err, playlists) {
    if ( err ) {
      this.setState({ error: err });
    } else {
      this.setState({ error: null, playlists: playlists });
    }
  },

  componentWillMount: function() {
    GlobalActions.loadExplorePlaylists(this._onExplorePlaylistsChange);
    this.listenTo(ExploreStore, this._onExplorePlaylistsChange);
  },

  render: function() {
    return (
      <section className="content explore">

        <DocumentTitle title="Explore" />

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-line-chart"></i>
          </div>
          <h5 className="title">Trending Playlists</h5>
        </div>

        <PlaylistList playlists={this.state.playlists.trending} />

        <div className="title-container">
          <div className="icon-container">
            <i className="fa fa-asterisk"></i>
          </div>
          <h5 className="title">Newest Playlists</h5>
        </div>

        <PlaylistList playlists={this.state.playlists.newest} />

      </section>
    );
  }

});

module.exports = React.createFactory(ExplorePage);
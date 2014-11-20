/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');

var DocumentTitle           = require('../components/DocumentTitle');
var AuthenticatedRouteMixin = require('../mixins/AuthenticatedRouteMixin');
var CreatePlaylistForm      = require('../components/CreatePlaylistForm');

var CreatePlaylistPage = React.createClass({

  mixins: [AuthenticatedRouteMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  render: function() {
    return (
      <section className="content create-playlist">

        <DocumentTitle title="Create Playlist" />

        <CreatePlaylistForm currentUser={this.props.currentUser} />

      </section>
    );
  }

});

module.exports = React.createFactory(CreatePlaylistPage);
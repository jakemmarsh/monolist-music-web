/**
 * @jsx React.DOM
 */
'use strict';

var React                   = require('react/addons');

var AuthenticatedRouteMixin = require('../mixins/AuthenticatedRouteMixin');
var CreatePlaylistForm      = require('../components/CreatePlaylistForm');

var CreatePlaylistPage = React.createClass({

  mixins: [AuthenticatedRouteMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  componentDidMount: function() {
    this.props.updatePageTitle('Create Playlist');
  },

  render: function() {
    return (
      <section className="content create-playlist">
        <CreatePlaylistForm currentUser={this.props.currentUser} />
      </section>
    );
  }

});

module.exports = React.createFactory(CreatePlaylistPage);
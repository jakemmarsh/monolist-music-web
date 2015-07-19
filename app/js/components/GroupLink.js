'use strict';

var React        = require('react/addons');
var _            = require('lodash');
var Link         = require('react-router').Link;

var GroupLink = React.createClass({

  propTypes: {
    group: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      group: {}
    };
  },

  render: function() {
    var backgroundStyle = {};

    if ( this.props.group.imageUrl ) {
      backgroundStyle.backgroundImage = 'url(' + this.props.group.imageUrl + ')';
    }

    return (
      <div className="playlist-group-link" style={backgroundStyle}>

        <div className="top-container">
          <h5 className="title">{this.props.group.title}</h5>

          <div className="stats-container">
            <div className="member-count-container">
              <i className="fa fa-users"></i> {this.props.group.members ? this.props.group.members.length : 0}
            </div>
            <div className="playlist-count-container">
              <i className="fa fa-list"></i> {this.props.group.playlists ? this.props.group.playlists.length : 0}
            </div>
          </div>

          <Link to="Group" params={{ slug: this.props.group.slug }} />
        </div>

        <Link to="Group" params={{ slug: this.props.group.slug }} className="go-button">
          <i className="fa fa-angle-right" />
        </Link>

      </div>
    );
  }

});

module.exports = GroupLink;
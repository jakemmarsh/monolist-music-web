'use strict';

var React        = require('react/addons');
var Link         = require('react-router').Link;

var GroupCard = React.createClass({

  propTypes: {
    group: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      group: {}
    };
  },

  render: function() {
    var imageStyle = {};

    if ( this.props.group.imageUrl ) {
      imageStyle.backgroundImage = 'url(' + this.props.group.imageUrl + ')';
    }

    return (
      <div className="group-card">

        <div className="image-container">
          <div className="image" style={imageStyle}>
            <Link to="Group" params={{ slug: this.props.group.slug }} />
          </div>
        </div>

        <div className="details-container">
          <Link to="Group" params={{ slug: this.props.group.slug }}>
            <h5 className="title flush--top">{this.props.group.title}</h5>
          </Link>

          <div className="stats-container">
            <div className="member-count-container">
              <i className="fa fa-users"></i> {this.props.group.members ? this.props.group.members.length : 0}
            </div>
            <div className="playlist-count-container">
              <i className="fa fa-list"></i> {this.props.group.playlists ? this.props.group.playlists.length : 0}
            </div>
          </div>
        </div>

      </div>
    );
  }

});

module.exports = GroupCard;
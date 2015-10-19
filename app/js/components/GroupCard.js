'use strict';

import React  from 'react';
import {Link} from 'react-router';

var GroupCard = React.createClass({

  propTypes: {
    group: React.PropTypes.object
  },

  getDefaultProps() {
    return {
      group: {}
    };
  },

  render() {
    let imageStyle = {};

    if ( this.props.group.imageUrl ) {
      imageStyle.backgroundImage = 'url(' + this.props.group.imageUrl + ')';
    }

    return (
      <div className="group-card nudge-half--bottom nudge-half--right">
        <div className="group-card-inner">

          <div className="image-container">
            <div className="image" style={imageStyle}>
              <Link to={`/group/${this.props.group.slug}`} />
            </div>
          </div>

          <div className="details-container">
            <Link to={`/group/${this.props.group.slug}`}>
              <h5 className="title flush--top">{this.props.group.title}</h5>
            </Link>

            <div className="stats-container">
              <div className="member-count-container">
                <i className="icon-user"></i> {this.props.group.memberships ? this.props.group.memberships.length : 0}
              </div>
              <div className="playlist-count-container">
                <i className="icon-list highlight"></i> {this.props.group.playlists ? this.props.group.playlists.length : 0}
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

});

export default GroupCard;
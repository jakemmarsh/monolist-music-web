'use strict';

import React  from 'react';
import _      from 'lodash';
import {Link} from 'react-router';

const Avatar = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    includeLink: React.PropTypes.bool,
    style: React.PropTypes.object,
    size: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  },

  getDefaultProps() {
    return {
      user: {},
      includeLink: true,
      style: {}
    };
  },

  renderLink() {
    if ( this.props.includeLink && !_.isEmpty(this.props.user) ) {
      return (
        <Link to={`/profile/${this.props.user.username}`} />
      );
    }
  },

  render() {
    let styles = this.props.style;

    // TODO: update this logic for React 0.14
    _.merge(styles, {
      'height': this.props.size,
      'width': this.props.size,
      'backgroundImage': this.props.user.imageUrl ? 'url(' + this.props.user.imageUrl + ')' : null
    });

    return (
      <div className="avatar" style={styles}>
        {this.renderLink()}
      </div>
    );
  }

});

export default Avatar;
'use strict';

import React  from 'react';
import cx     from 'classnames';
import _      from 'lodash';
import {Link} from 'react-router';

const Avatar = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    includeLink: React.PropTypes.bool,
    style: React.PropTypes.object,
    className: React.PropTypes.string,
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
    const classes = cx('avatar', {
      [this.props.className]: !!this.props.className
    });

    return (
      <div className={classes}
           style={{ height: this.props.size, width: this.props.size, backgroundImage: this.props.user.imageUrl ? 'url(' + this.props.user.imageUrl + ')' : null}}>
        {this.renderLink()}
      </div>
    );
  }

});

export default Avatar;

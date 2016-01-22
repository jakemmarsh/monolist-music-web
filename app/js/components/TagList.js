'use strict';

import React  from 'react';
import {Link} from 'react-router';
import _      from 'lodash';

var TagList = React.createClass({

  propTypes: {
    type: React.PropTypes.string,
    tags: React.PropTypes.array,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      tags: []
    };
  },

  renderTags() {
    return _.map(this.props.tags, (tag, index) => {
      return (
        <li className="tag" key={index}>
          {tag}
          <Link to={`/search/${this.props.type}s?q=${encodeURIComponent(tag)}`} />
        </li>
      );
    });
  },

  render() {
    let classes = 'tags-container' + (this.props.className ? ' ' + this.props.className : '');

    return (
      <ul className={classes}>
        {this.renderTags()}
      </ul>
    );
  }

});

export default TagList;

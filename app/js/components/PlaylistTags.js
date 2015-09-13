'use strict';

import React  from 'react/addons';
import {Link} from 'react-router';
import _      from 'lodash';

var PlaylistTags = React.createClass({

  propTypes: {
    tags: React.PropTypes.array.isRequired,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      tags: [],
      className: ''
    };
  },

  renderTags() {
    return _.map(this.props.tags, (tag, index) => {
      return (
        <li className="tag" key={index}>
          {tag}
          <Link to={`/search/playlists?q=${tag}`} />
        </li>
      );
    });
  },

  render() {
    let classes = this.props.className + ' playlist-tags-container';

    return (
      <ul className={classes}>
        {this.renderTags()}
      </ul>
    );
  }

});

export default PlaylistTags;
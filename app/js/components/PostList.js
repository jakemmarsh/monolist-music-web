'use strict';

import React        from 'react/addons';
import _            from 'lodash';

var PostList = React.createClass({

  propTypes: {
    posts: React.PropTypes.array.isRequired,
    cardClassName: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      posts: []
    };
  },

  renderPosts() {
    let elements = null;

    if ( !_.isEmpty(this.props.posts) ) {
    elements = _.map(this.props.posts, (post, index) => {
      return (
        <li className={this.props.cardClassName} key={index}>
          {post.body}
        </li>
      );
    });
    } else {
      elements = (
        <h3 className="flush--top light">No posts yet!</h3>
      );
    }

    return elements;
  },

  render() {
    return (
      <ul className="post-list">

        {this.renderPosts()}

      </ul>
    );
  }

});

export default PostList;
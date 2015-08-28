'use strict';

import React           from 'react/addons';
import _               from 'lodash';
import {ListenerMixin} from 'reflux';

import PostActions     from '../actions/PostActions';
import CreatePostForm  from '../components/CreatePostForm';
import PostList        from '../components/PostList';

var GroupFeedPage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    group: React.PropTypes.object.isRequired,
    posts: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      posts: this.props.posts || [],
      loading: false,
      error: null
    };
  },

  componentDidUpdate(prevProps) {
    if ( !_.isEqual(prevProps.posts, this.props.posts) ) {
      this.setState({ posts: this.props.posts });
    }
  },

  deletePost(postId, cb = function(){}) {
    let postsCopy = _.reject(this.state.posts, function(post) {
      return post.id === postId;
    });

    this.setState({ posts: postsCopy }, () => {
      PostActions.delete(postId, cb);
    });
  },

  renderCreatePostForm() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <CreatePostForm currentUser={this.props.currentUser}
                        className="nudge-half--bottom" />
      );
    }
  },

  renderPosts() {
    if ( !_.isEmpty(this.state.posts) ) {
      return (
        <PostList posts={this.state.posts}
                  showContextMenu={this.props.showContextMenu}
                  currentTrack={this.props.currentTrack}
                  deletePost={this.deletePost}
                  currentUser={this.props.currentUser}
                  userCollaborations={this.props.userCollaborations} />
      );
    } else {
      return (
        <h4 className="hard nudge--bottom light text-center">No posts have been made in this group yet!</h4>
      );
    }
  },

  render() {
    return (
      <div>

        {this.renderCreatePostForm()}

        {this.renderPosts()}

      </div>
    );
  }

});

export default GroupFeedPage;
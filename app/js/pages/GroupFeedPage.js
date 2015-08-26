'use strict';

import React                from 'react/addons';
import _                    from 'lodash';
import {ListenerMixin}      from 'reflux';

import GroupActions         from '../actions/GroupActions';
import PostActions          from '../actions/PostActions';
import ViewingPostListStore from '../stores/ViewingPostListStore';
import CreatePostForm       from '../components/CreatePostForm';
import PostList             from '../components/PostList';

var GroupFeedPage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    group: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      loading: false,
      error: null,
      posts: []
    };
  },

  _onPostsChange(err, posts) {
    if ( err ) {
      this.setState({ error: err });
    } else {
      this.setState({
        loading: false,
        error: null,
        posts: posts || []
      });
    }
  },

  componentDidMount() {
    this.listenTo(ViewingPostListStore, this._onPostsChange);
    if ( this.props.group.id ) {
      GroupActions.loadPosts(this.props.group.id);
    }
  },

  componentDidUpdate(prevProps) {
    if ( this.props.group.id && !_.isEqual(this.props.group, prevProps.group) ) {
      GroupActions.loadPosts(this.props.group.id);
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

  render() {
    return (
      <div>

        {this.renderCreatePostForm()}

        <PostList posts={this.state.posts}
                  showContextMenu={this.props.showContextMenu}
                  currentTrack={this.props.currentTrack}
                  deletePost={this.deletePost}
                  currentUser={this.props.currentUser}
                  userCollaborations={this.props.userCollaborations} />

      </div>
    );
  }

});

export default GroupFeedPage;
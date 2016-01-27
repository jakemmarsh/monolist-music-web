'use strict';

import React            from 'react';
import _                from 'lodash';
import {ListenerMixin}  from 'reflux';
import {History}        from 'react-router';
import DocumentTitle    from 'react-document-title';

import Helpers          from '../utils/Helpers';
import PostActions      from '../actions/PostActions';
import ViewingPostStore from '../stores/ViewingPostStore';
import PostCard         from '../components/PostCard';

const PostPage = React.createClass({

  mixins: [ListenerMixin, History],

  propTypes: {
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    params: React.PropTypes.object
  },

  getInitialState() {
    return {
      post: {},
      loading: false,
      error: null
    };
  },

  _onPostChange(err, post) {
    if ( err ) {
      this.setState({
        error: err,
        loading: false
      });
    } else {
      this.setState({
        error: null,
        loading: false,
        post: post || {}
      });
    }
  },

  componentDidMount() {
    this.listenTo(ViewingPostStore, this._onPostChange);
    PostActions.open(this.props.params.id);
  },

  deletePost(postId, cb = function(){}) {
    PostActions.delete(postId, () => {
      cb();
      this.history.pushState(null, '/');
    });
  },

  renderPost() {
    let trackIndex = 0;
    let playlist = {
      tracks: this.state.post.track ? [this.state.post.track] : []
    };

    if ( !_.isEmpty(this.state.post) ) {
      return (
        <PostCard post={this.state.post}
                  trackIndex={trackIndex}
                  playlist={playlist}
                  currentUser={this.props.currentUser}
                  deletePost={this.deletePost}
                  currentTrack={this.props.currentTrack}
                  userCollaborations={this.props.userCollaborations} />
      );
    }
  },

  render() {
    let title = this.state.post.body ? this.state.post.body.substring(0, 15) + '...' : 'Post';

    return (
      <DocumentTitle title={Helpers.buildPageTitle(title)}>
      <section className="content post fx-4 ord-2 ovy-a">

        {this.renderPost()}

      </section>
      </DocumentTitle>
    );
  }

});

export default PostPage;
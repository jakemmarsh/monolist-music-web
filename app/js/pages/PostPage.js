'use strict';

import React           from 'react/addons';
import _               from 'lodash';
import {ListenerMixin} from 'reflux';
import {Navigation}    from 'react-router';
import DocumentTitle   from 'react-document-title';

import Helpers         from '../utils/Helpers';
import PostActions     from '../actions/PostActions';
import PostCard        from '../components/PostCard';

const PostPage = React.createClass({

  mixins: [ListenerMixin, Navigation],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    currentTrack: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    group: React.PropTypes.object.isRequired,
    posts: React.PropTypes.array.isRequired,
    showContextMenu: React.PropTypes.func,
    params: React.PropTypes.object.isRequired
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
        error: err.message,
        loading: false
      });
    } else {
      this.setState({
        error: null,
        loading: false,
        post: post || {}
      })
    }
  },

  componentDidMount() {
    this.listenTo(ViewingPostStore, this._onPostChange);
    PostActions.open(this.props.params.id);
  },

  deletePost(postId, cb = function(){}) {
    PostActions.delete(this.props.post.id, () => {
      cb();
      this.transitionTo('Explore');
    });
  },

  render() {
    let title = this.state.post.body ? this.state.post.body.substring(0, 15) + '...' : 'Post';
    let trackIndex = 0;
    let playlist = this.state.post.track ? [this.state.post.track] : [];

    return (
      <DocumentTitle title={Helpers.buildPageTitle(title)}>
      <section className="content post">

        <PostCard post={this.state.post}
                  trackIndex={trackIndex}
                  playlist={playlist}
                  currentUser={this.props.currentUser}
                  showContextMenu={this.props.showContextMenu}
                  deletePost={this.deletePost}
                  currentTrack={this.props.currentTrack}
                  userCollaborations={this.props.userCollaborations} />

      </section>
      </DocumentTitle>
    );
  }

});

export default PostPage;
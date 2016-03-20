'use strict';

import React                      from 'react';
import _                          from 'lodash';
import {ListenerMixin}            from 'reflux';
import DocumentTitle              from 'react-document-title';

import Helpers                    from '../utils/Helpers';
import GlobalActions              from '../actions/GlobalActions';
import PostActions                from '../actions/PostActions';
import ViewingRecentlyPlayedStore from '../stores/ViewingRecentlyPlayedStore';
import ViewingPostListStore       from '../stores/ViewingPostListStore';
import Title                      from '../components/Title';
import PostList                   from '../components/PostList';
import PlaylistList               from '../components/PlaylistList';
import CreatePostForm             from '../components/CreatePostForm';

const ExplorePage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    userCollaborations: React.PropTypes.array
  },

  getDefaultProps() {
    return {
      currentUser: {}
    };
  },

  getInitialState() {
    return {
      posts: [],
      recentlyPlayedPlaylists: [],
      error: null
    };
  },

  _onPostsChange(err, posts) {
    if ( err ) {
      this.setState({ error: err.data || err });
    } else {
      this.setState({
        error: null,
        posts: posts || []
      });
    }
  },

  _onRecentlyPlayedChange(err, playlists) {
    if ( err ) {
      this.setState({ error: err.data || err });
    } else {
      this.setState({
        error: null,
        recentlyPlayedPlaylists: playlists
      });
    }
  },

  componentDidMount() {
    this.listenTo(ViewingRecentlyPlayedStore, this._onRecentlyPlayedChange);
    this.listenTo(ViewingPostListStore, this._onPostsChange);
    GlobalActions.loadExplorePosts();
    GlobalActions.loadExploreRecentlyPlayed();
  },

  componentDidUpdate(prevProps) {
    if ( !_.isEqual(this.props.currentUser, prevProps.currentUser) && !_.isEmpty(this.props.currentUser) ) {
      GlobalActions.loadExplorePosts();
      GlobalActions.loadExploreRecentlyPlayed();
    }
  },

  deletePost(postId, cb = function(){}) {
    const postsCopy = _.reject(this.state.posts, function(post) {
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
      <DocumentTitle title={Helpers.buildPageTitle('Explore')}>
        <section className="content explore fx-4 ord-2 ovy-a">

          <div className="pure-g">
            <div className="pure-u-2-3 soft-half--right">
              {this.renderCreatePostForm()}
              <Title text="Global Feed" icon="globe" />
              <PostList posts={this.state.posts}
                        currentTrack={this.props.currentTrack}
                        deletePost={this.deletePost}
                        currentUser={this.props.currentUser}
                        userCollaborations={this.props.userCollaborations} />
            </div>

            <div className="pure-u-1-3 soft-half--left">
              <Title text="Recently Played" icon="clock-o" />
              <PlaylistList playlists={this.state.recentlyPlayedPlaylists} className="no-min-width" cardClassName="pure-u-1" />
            </div>
          </div>

        </section>
      </DocumentTitle>
    );
  }

});

export default ExplorePage;

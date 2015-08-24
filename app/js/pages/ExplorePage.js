'use strict';

import React                      from 'react/addons';
import _                          from 'lodash';
import {ListenerMixin}            from 'reflux';
import DocumentTitle              from 'react-document-title';

import Helpers                    from '../utils/Helpers';
import GlobalActions              from '../actions/GlobalActions';
import PostActions                from '../actions/PostActions';
import ViewingRecentSearchesStore from '../stores/ViewingRecentSearchesStore';
import ViewingPostListStore       from '../stores/ViewingPostListStore';
import Title                      from '../components/Title';
import PostList                   from '../components/PostList';
import RecentSearchesList         from '../components/RecentSearchesList';
import CreatePostForm             from '../components/CreatePostForm';

var ExplorePage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    showContextMenu: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      currentUser: {},
      showContextMenu: function() {}
    };
  },

  getInitialState() {
    return {
      posts: [],
      searches: [],
      error: null
    };
  },

  _onPostsChange(err, posts) {
    if ( err ) {
      this.setState({ error: err.message || err.data });
    } else {
      console.log('about to set state with new posts:', posts);
      this.setState({
        error: null,
        posts: posts || []
      });
    }
  },

  _onRecentSearchesChange(err, searches) {
    if ( err ) {
      this.setState({ error: err.message || err.data });
    } else {
      this.setState({
        error: null,
        searches: searches
      });
    }
  },

  componentWillMount() {
    this.listenTo(ViewingRecentSearchesStore, this._onRecentSearchesChange);
    this.listenTo(ViewingPostListStore, this._onPostsChange);
    GlobalActions.loadExplorePage();
  },

  componentDidUpdate(prevProps) {
    if ( !_.isEqual(this.props.currentUser, prevProps.currentUser) && !_.isEmpty(this.props.currentUser) ) {
      GlobalActions.loadExplorePage();
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
      <DocumentTitle title={Helpers.buildPageTitle('Explore')}>
        <section className="content explore">

          <div className="pure-g">
            <div className="pure-u-2-3 soft-half--right">
              {this.renderCreatePostForm()}
              <Title text="Latest Posts" icon="bullhorn" />
              <PostList posts={this.state.posts}
                        showContextMenu={this.props.showContextMenu}
                        currentTrack={this.props.currentTrack}
                        deletePost={this.deletePost}
                        currentUser={this.props.currentUser} />
            </div>

            <div className="pure-u-1-3 soft-half--left">
              <Title text="Recent Searches" icon="search" />
              <RecentSearchesList type="playlists" searches={this.state.searches} />
            </div>
          </div>

        </section>
      </DocumentTitle>
    );
  }

});

export default ExplorePage;
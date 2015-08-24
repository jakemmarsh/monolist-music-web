'use strict';

import React              from 'react/addons';
import _                  from 'lodash';
import {ListenerMixin}    from 'reflux';
import DocumentTitle      from 'react-document-title';

import Helpers            from '../utils/Helpers';
import GlobalActions      from '../actions/GlobalActions';
import PostActions        from '../actions/PostActions';
import ExploreStore       from '../stores/ExploreStore';
import Title              from '../components/Title';
import PostList           from '../components/PostList';
import RecentSearchesList from '../components/RecentSearchesList';
import CreatePostForm     from '../components/CreatePostForm';

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
      data: {
        posts: [],
        searches: []
      },
      error: null
    };
  },

  _onDataChange(err, data) {
    if ( err ) {
      this.setState({ error: err });
    } else {
      this.setState({
        error: null,
        data: data || {
          posts: [],
          searches: []
        }
      });
    }
  },

  componentWillMount() {
    this.listenTo(ExploreStore, this._onDataChange);
    GlobalActions.loadExplorePage();
  },

  componentDidUpdate(prevProps) {
    if ( !_.isEqual(this.props.currentUser, prevProps.currentUser) && !_.isEmpty(this.props.currentUser) ) {
      GlobalActions.loadExplorePage();
    }
  },

  deletePost(postId, cb = function(){}) {
    let dataCopy = this.state.data;

    dataCopy.posts = _.reject(dataCopy.posts, function(post) {
      return post.id === postId;
    });

    this.setState({ data: dataCopy }, () => {
      // TODO: listen to this action somewhere
      PostActions.delete(postId);
      cb();
    });
  },

  handlePostCreation(post, cb = function(){}) {
    let dataCopy = this.state.data;

    dataCopy.posts.unshift(post);

    this.setState({ data: dataCopy }, () => {
      PostActions.createGlobalPost(post);
      cb();
    });
  },

  renderCreatePostForm() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <CreatePostForm currentUser={this.props.currentUser}
                        handlePostCreation={this.handlePostCreation}
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
              <PostList posts={this.state.data.posts}
                        showContextMenu={this.props.showContextMenu}
                        currentTrack={this.props.currentTrack}
                        deletePost={this.deletePost}
                        currentUser={this.props.currentUser} />
            </div>

            <div className="pure-u-1-3 soft-half--left">
              <Title text="Recent Searches" icon="search" />
              <RecentSearchesList type="playlists" searches={this.state.data.searches} />
            </div>
          </div>

        </section>
      </DocumentTitle>
    );
  }

});

export default ExplorePage;
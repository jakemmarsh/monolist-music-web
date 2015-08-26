'use strict';

import React    from 'react/addons';
import _        from 'lodash';

import PostCard from './PostCard';

var PostList = React.createClass({

  propTypes: {
    posts: React.PropTypes.array.isRequired,
    currentUser: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    cardClassName: React.PropTypes.string,
    showContextMenu: React.PropTypes.func,
    deletePost: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      posts: [],
      showContextMenu: function() {},
      deletePost: function() {}
    };
  },

  buildPlaylist() {
    let playlist = { tracks: [] };

    _.each(this.props.posts, (post) => {
      if ( !_.isEmpty(post.track) ) {
        playlist.tracks.push(post.track);
      }
    });

    return playlist;
  },

  renderPosts() {
    let elements = null;
    let currentTrackIndex = -1;

    if ( !_.isEmpty(this.props.posts) ) {
    elements = _.map(this.props.posts, (post, index) => {
      if ( post.track ) { currentTrackIndex += 1; }

      return (
        <li className={this.props.cardClassName} key={index}>
          <PostCard post={post}
                    trackIndex={currentTrackIndex}
                    playlist={this.buildPlaylist()}
                    currentUser={this.props.currentUser}
                    showContextMenu={this.props.showContextMenu}
                    deletePost={this.props.deletePost}
                    currentTrack={this.props.currentTrack}
                    userCollaborations={this.props.userCollaborations} />
        </li>
      );
    });
    } else {
      elements = (
        <h3 className="nudge--top text-center light">No posts yet!</h3>
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
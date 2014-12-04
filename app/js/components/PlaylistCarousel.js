/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react');
var _            = require('lodash');
var $            = require('jquery');

var PlaylistLink = require('./PlaylistLink');

var PlaylistCarousel = React.createClass({

  propTypes: {
    playlists: React.PropTypes.array.isRequired
  },

  getDefaultProps: function() {
    return {
      playlists: [
        {
          id: 1,
          slug: 'my-rap-playlist',
          title: 'My Rap Playlist',
          tags: ['Rap', 'Hip-Hop', 'Party'],
          image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
          likes: 34,
          plays: 923
        },
        {
          id: 1,
          slug: 'my-rap-playlist',
          title: 'My Rap Playlist',
          tags: ['Rap', 'Hip-Hop', 'Party'],
          image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
          likes: 34,
          plays: 923
        },
        {
          id: 1,
          slug: 'my-rap-playlist',
          title: 'My Rap Playlist',
          tags: ['Rap', 'Hip-Hop', 'Party'],
          image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
          likes: 34,
          plays: 923
        },
        {
          id: 1,
          slug: 'my-rap-playlist',
          title: 'My Rap Playlist',
          tags: ['Rap', 'Hip-Hop', 'Party'],
          image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
          likes: 34,
          plays: 923
        },
        {
          id: 1,
          slug: 'my-rap-playlist',
          title: 'My Rap Playlist',
          tags: ['Rap', 'Hip-Hop', 'Party'],
          image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
          likes: 34,
          plays: 923
        },
        {
          id: 1,
          slug: 'my-rap-playlist',
          title: 'My Rap Playlist',
          tags: ['Rap', 'Hip-Hop', 'Party'],
          image: 'http://8tracks.imgix.net/i/000/307/062/tumblr_mgumffe90i1ql91h0o1_1280-9978.jpg?fm=jpg&q=65&w=1024&h=1024&fit=max',
          likes: 34,
          plays: 923
        }
      ]
    };
  },

  componentDidMount: function() {
    var containerWidth = $(this.refs.container.getDOMNode()).width();
    var leftOffset = parseInt($(this.refs.scrollingList.getDOMNode()).css('left'), 10);
    var playlistLinkWidth = 220;
    var numPlaylistsShown = containerWidth/playlistLinkWidth;

    this.setState({
      leftOffset: leftOffset,
      containerWidth: containerWidth,
      playlistLinkWidth: playlistLinkWidth,
      numPlaylistsShown: numPlaylistsShown
    });

  },

  scrollLeft: function() {
    var widthOfDisplayedPlaylists = this.state.playlistLinkWidth * this.state.numPlaylistsShown;
    var numPlaylistsScrolledRight = Math.abs(this.state.leftOffset/this.state.playlistLinkWidth);
    var newLeftOffset;

    // if scrolling let widthOfDisplayedPlaylists would result in blank space,
    // scroll only the amount left to display remaining playlists
    if ( numPlaylistsScrolledRight < 4 ) {
      newLeftOffset = this.state.leftOffset + numPlaylistsScrolledRight*this.state.playlistLinkWidth;
    } else {
      newLeftOffset = this.state.leftOffset + widthOfDisplayedPlaylists;
    }

    this.setState({
      leftOffset: newLeftOffset
    });
  },

  scrollRight: function() {
    var widthOfDisplayedPlaylists = this.state.playlistLinkWidth * this.state.numPlaylistsShown;
    var numPlaylistsScrolledLeft = Math.abs(this.state.leftOffset)/this.state.playlistLinkWidth + this.state.numPlaylistsShown;
    var remainingPlaylistsWidth = (this.props.playlists.length - numPlaylistsScrolledLeft)*this.state.playlistLinkWidth;
    var newLeftOffset;

    // if scrolling right widthOfDisplayedPlaylists would result in blank space,
    // scroll only the amount right to display remaining playlists
    if ( remainingPlaylistsWidth < widthOfDisplayedPlaylists || remainingPlaylistsWidth === 0 ) {
      newLeftOffset = this.state.leftOffset - remainingPlaylistsWidth;
    } else {
      newLeftOffset = this.state.leftOffset - widthOfDisplayedPlaylists;
    }

    this.setState({
      leftOffset: newLeftOffset
    });
  },

  renderPlaylists: function() {
    var playlistElements = _.map(this.props.playlists, function(playlist, index) {
      return (
        <li key={index}>
          <PlaylistLink playlist={playlist} />
        </li>
      );
    });

    return playlistElements;
  },

  render: function() {
    var scrollingStyle = {
      'left': (this.state && this.state.leftOffset) ? this.state.leftOffset + 'px' : ''
    };

    return (
      <div className="playlist-carousel-container">

          <span className="left-arrow" onClick={this.scrollLeft}>
            <i className="fa fa-chevron-left"></i>
          </span>

          <div ref="container" className="playlists">
            <ul ref="scrollingList" className="scrolling-list" style={scrollingStyle}>
              {this.renderPlaylists()}
            </ul>
          </div>

          <span className="right-arrow" onClick={this.scrollRight}>
            <i className="fa fa-chevron-right"></i>
          </span>

      </div>
    );
  }

});

module.exports = React.createFactory(PlaylistCarousel);
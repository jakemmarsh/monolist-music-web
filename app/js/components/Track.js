/**
 * @jsx React.DOM
 */
 'use strict';

var React           = require('react/addons');
var _               = require('lodash');
var Link            = React.createFactory(require('react-router').Link);
var cx              = React.addons.classSet;

var Helpers         = require('../utils/Helpers');
var OpenLinkMixin   = require('../mixins/OpenLinkMixin');
var PlaylistActions = require('../actions/PlaylistActions');
var TrackActions    = require('../actions/TrackActions');
var CommentList     = require('./CommentList');

var Track = React.createClass({

  mixins: [OpenLinkMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    userIsCreator: React.PropTypes.bool,
    userIsCollaborator: React.PropTypes.bool,
    track: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    playlist: React.PropTypes.object.isRequired,
    type: React.PropTypes.string.isRequired,
    isActive: React.PropTypes.bool,
    showContextMenu: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      userIsCreator: false,
      userIsCollaborator: false,
      track: {},
      isActive: false
    };
  },

  getInitialState: function() {
    return {
      displayComments: false,
      isUpvoted: false,
      isDownvoted: false,
      score: 0
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if ( this.props.type === 'playlist' && !_.isEmpty(nextProps.track) && !_.isEqual(this.props.track, nextProps.track) ) {
      this.setState({
        isUpvoted: !!_.where(nextProps.track.upvotes, { userId: nextProps.currentUser.id }).length,
        isDownvoted: !!_.where(nextProps.track.downvotes, { userId: nextProps.currentUser.id }).length,
        score: nextProps.track.upvotes.length - nextProps.track.downvotes.length
      });
    }
  },

  getCreatorUsername: function() {
    return this.props.track.user ? this.props.track.user.username : '';
  },

  toggleCommentDisplay: function(evt) {
    evt.stopPropagation();

    this.setState({
      displayComments: !this.state.displayComments
    });
  },

  selectTrack: function() {
    PlaylistActions.play(this.props.playlist, function() {
      TrackActions.select(this.props.track, this.props.index);
    }.bind(this));
  },

  upvote: function(evt) {
    var newScore = this.state.score;

    evt.stopPropagation();

    if ( this.state.isUpvoted ) {
      newScore -= 1;
    } else if ( this.state.isDownvoted ) {
      newScore += 2;
    } else {
      newScore += 1;
    }

    this.setState({
      isUpvoted: !this.state.isUpvoted,
      isDownvoted: false,
      score: newScore
    }, TrackActions.upvote(this.props.track));
  },

  downvote: function(evt) {
    var newScore = this.state.score;

    evt.stopPropagation();

    if ( this.state.isDownvoted ) {
      newScore += 1;
    } else if ( this.state.isUpvoted ) {
      newScore -= 2;
    } else {
      newScore -= 1;
    }

    this.setState({
      isDownvoted: !this.state.isDownvoted,
      isUpvoted: false,
      score: newScore
    }, TrackActions.downvote(this.props.track));
  },

  showContextMenu: function(evt) {
    this.props.showContextMenu(this.props.track, evt);
  },

  stopPropagation: function(evt) {
    evt.stopPropagation();
  },

  renderDropdownToggle: function() {
    var element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <div className="dropdown-icon-container">
          <i className="fa fa-ellipsis-h" onClick={this.showContextMenu} />
        </div>
      );
    }

    return element;
  },

  renderArtwork: function() {
    var element = null;
    var artworkStyle;

    if ( this.props.track.imageUrl ) {
      artworkStyle = {
        'backgroundImage': 'url(' + this.props.track.imageUrl + ')'
      };

      element = (
        <div className="artwork-container">
          <div className="artwork" style={artworkStyle} />
        </div>
      );
    }

    return element;
  },

  renderDuration: function() {
    var element = null;

    if ( this.props.track.duration ) {
      element = (
        <span className="duration">{Helpers.formatSecondsAsTime(this.props.track.duration)}</span>
      );
    }

    return element;
  },

  renderCollaboratorOptions: function() {
    var element = null;
    var scoreClasses = cx({
      'score': true,
      'upvoted': this.state.isUpvoted,
      'downvoted': this.state.isDownvoted
    });
    var upvoteClasses = cx({
      'fa': true,
      'fa-chevron-up': true,
      'upvote': true,
      'active': this.state.isUpvoted
    });
    var downvoteClasses = cx({
      'fa': true,
      'fa-chevron-down': true,
      'downvote': true,
      'active': this.state.isDownvoted
    });

    if ( this.props.type === 'playlist' && (this.props.userIsCreator || this.props.userIsCollaborator) ) {
      element = (
        <div className="upvote-downvote-container">
          <span className={scoreClasses}>{this.state.score}</span>
          <i className={upvoteClasses} onClick={this.upvote}></i>
          <i className={downvoteClasses} onClick={this.downvote}></i>
        </div>
      );
    }

    return element;
  },

  renderTrackCreator: function() {
    var element = null;

    if ( this.props.type === 'playlist' && this.props.track.user ) {
      element = (
        <div className="added-by-container">
          added by <Link to="Profile" params={{username: this.props.track.user.username}} onClick={this.stopPropagation}>{this.props.track.user.username}</Link>
        </div>
      );
    }

    return element;
  },

  renderTrackSource: function() {
    var element;
    var elementClasses = 'source ' + this.props.track.source;
    var iconClasses = 'fa fa-' + this.props.track.source;

    if ( this.props.track.source === 'youtube' ) {
      iconClasses += '-play';
    }

    element = (
      <div className={elementClasses}>
        <i className={iconClasses}></i>
        <a href={this.props.track.sourceUrl} onClick={this.openExternalLink} target="_blank" />
      </div>
    );

    return element;
  },

  renderToggleCommentDisplay: function() {
    var element = null;
    var spanString = this.state.displayComments ? 'Hide Comments' : 'Show Comments';

    if ( this.props.type === 'playlist' && (this.props.userIsCreator || this.props.userIsCollaborator) ) {
      element = (
        <a className="inline-block nudge-quarter--top" onClick={this.toggleCommentDisplay}>{spanString}</a>
      );
    }

    return element;
  },

  renderCommentList: function() {
    var element = null;

    if( this.props.type === 'playlist' && (this.props.userIsCreator || this.props.userIsCollaborator) ) {
      element = (
        <CommentList currentUser={this.props.currentUser}
                     track={this.props.track}
                     comments={this.props.track.comments}
                     shouldDisplay={this.state.displayComments} />
      );
    }

    return element;
  },

  render: function() {
    var classes = cx({
      'track': true,
      'active': this.props.isActive
    });

    return (
      <li className={classes} onClick={this.selectTrack}>

        <div className="track-info-container">
          {this.renderDropdownToggle()}
          {this.renderArtwork()}
          <div className="info-container">
            <h5 className="title">{this.props.track.title} {this.renderDuration()}</h5>
            <h6 className="artist">{this.props.track.artist}</h6>
            {this.renderToggleCommentDisplay()}
          </div>
          <div className="options-container">
            {this.renderCollaboratorOptions()}
            {this.renderTrackCreator()}
          </div>
          {this.renderTrackSource()}
        </div>

        {this.renderCommentList()}

      </li>
    );
  }

});

module.exports = React.createFactory(Track);
/**
 * @jsx React.DOM
 */
 'use strict';

var React           = require('react/addons');
var _               = require('underscore');
var Link            = React.createFactory(require('react-router').Link);

var PlaylistActions = require('../actions/PlaylistActions');
var TrackActions    = require('../actions/TrackActions');
var CommentList     = require('./CommentList');

var Helpers         = require('../utils/Helpers');

var cx              = React.addons.classSet;

var Track = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    userIsCollaborator: React.PropTypes.bool,
    track: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    playlist: React.PropTypes.object.isRequired,
    isActive: React.PropTypes.bool,
    showContextMenu: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      userIsCollaborator: false,
      track: {},
      isActive: false
    };
  },

  getInitialState: function() {
    return {
      displayComments: false
    };
  },

  getScore: function() {
    var score = 0;

    if ( this.props.track.upvotes && this.props.track.downvotes ) {
      score = this.props.track.upvotes.length - this.props.track.downvotes.length;
    }

    return score;
  },

  getCreatorUsername: function() {
    return this.props.track.user ? this.props.track.user.username : '';
  },

  isUpvoted: function() {
    return !!_.where(this.props.track.upvotes, { userId: this.props.currentUser.id }).length;
  },

  isDownvoted: function() {
    return !!_.where(this.props.track.downvotes, { userId: this.props.currentUser.id }).length;
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
    evt.stopPropagation();

    TrackActions.upvote(this.props.track);
  },

  downvote: function(evt) {
    evt.stopPropagation();

    TrackActions.downvote(this.props.track);
  },

  showContextMenu: function(evt) {
    this.props.showContextMenu(this.props.track, evt);
  },

  stopPropagation: function(evt) {
    evt.stopPropagation();
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
      'upvoted': this.isUpvoted(),
      'downvoted': this.isDownvoted()
    });
    var upvoteClasses = cx({
      'fa': true,
      'fa-chevron-up': true,
      'upvote': true,
      'active': this.isUpvoted()
    });
    var downvoteClasses = cx({
      'fa': true,
      'fa-chevron-down': true,
      'downvote': true,
      'active': this.isDownvoted()
    });

    if ( this.props.userIsCollaborator ) {
      element = (
        <div className="options-container">
          <div className="upvote-downvote-container">
            <span className={scoreClasses}>{this.getScore()}</span>
            <i className={upvoteClasses} onClick={this.upvote}></i>
            <i className={downvoteClasses} onClick={this.downvote}></i>
          </div>
          <div className="added-by-container">
            added by <Link to="Profile" params={{username: this.props.track.user.username}} onClick={this.stopPropagation}>{this.props.track.user.username}</Link>
          </div>
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
        <a href={this.props.track.sourceUrl} onClick={this.stopPropagation} target="_blank" />
      </div>
    );

    return element;
  },

  renderToggleCommentDisplay: function() {
    var element = null;
    var spanString = this.state.displayComments ? 'Hide Comments' : 'Show Comments';

    if ( this.props.type === 'playlist' ) {
      element = (
        <a className="inline-block nudge-quarter--top" onClick={this.toggleCommentDisplay}>{spanString}</a>
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
      <li className={classes} onClick={this.selectTrack} onContextMenu={this.showContextMenu}>

        <div className="track-info-container">
          {this.renderArtwork()}
          <div className="info-container">
            <h5 className="title">{this.props.track.title} {this.renderDuration()}</h5>
            <h6 className="artist">{this.props.track.artist}</h6>
            {this.renderToggleCommentDisplay()}
          </div>
          {this.renderCollaboratorOptions()}
          {this.renderTrackSource()}
        </div>

        <CommentList currentUser={this.props.currentUser}
                     track={this.props.track}
                     comments={this.props.track.trackComments}
                     shouldDisplay={this.state.displayComments} />

      </li>
    );
  }

});

module.exports = React.createFactory(Track);
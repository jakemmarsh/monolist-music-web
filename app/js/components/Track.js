/**
 * @jsx React.DOM
 */
 'use strict';

var React           = require('react/addons');
var Link            = React.createFactory(require('react-router').Link);

var PlaylistActions = require('../actions/PlaylistActions');
var TrackActions    = require('../actions/TrackActions');
var CommentList     = require('./CommentList');

var Helpers         = require('../utils/Helpers');

var cx              = React.addons.classSet;

var Track = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    track: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
    isActive: React.PropTypes.bool,
    selectTrack: React.PropTypes.func,
    showContextMenu: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      track: {},
      isActive: false,
      isUpvoted: false,
      isDownvoted: false
    };
  },

  getInitialState: function() {
    return {
      displayComments: false
    };
  },

  toggleCommentDisplay: function() {
    this.setState({
      displayComments: !this.state.displayComments
    });
  },

  selectTrack: function() {
    PlaylistActions.play(this.props.playlist, function() {
      TrackActions.select(this.props.track, this.props.index);
    }.bind(this));
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
      'upvoted': this.props.isUpvoted,
      'downvoted': this.props.isDownvoted
    });
    var upvoteClasses = cx({
      'fa': true,
      'fa-chevron-up': true,
      'upvote': true,
      'active': this.props.isUpvoted
    });
    var downvoteClasses = cx({
      'fa': true,
      'fa-chevron-down': true,
      'downvote': true,
      'active': this.props.isDownvoted
    });

    // if ( this.props.type === 'playlist' ) {
    //   element = (
    //     <div className="options-container">
    //       <div className="upvote-downvote-container">
    //         <span className={scoreClasses}>{this.props.track.upvotes - this.props.track.downvotes}</span>
    //         <i className={upvoteClasses}></i>
    //         <i className={downvoteClasses}></i>
    //       </div>
    //       <div className="added-by-container">
    //         added by <Link to="Profile" params={{username: 'jakemmarsh'}}>jakemmarsh</Link>
    //       </div>
    //     </div>
    //   );
    // }

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
      </div>
    );

    return element;
  },

  renderToggleCommentDisplay: function() {
    var element = null;

    // if ( this.props.type === 'playlist' ) {
    //   element = (
    //     <span onClick={this.toggleCommentDisplay}>Show/Hide Comments</span>
    //   );
    // }

    return element;
  },

  renderTrackComments: function() {
    var element = null;

    if ( this.props.track.comments ) {
      element = (
        <CommentList currentUser={this.props.currentUser}
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
    var artworkStyle = {
      'backgroundImage': this.props.track.imageUrl ? 'url(' + this.props.track.imageUrl + ')' : 'none'
    };

    return (
      <li className={classes}>
        <div className="track-info" onClick={this.selectTrack} onContextMenu={this.props.showContextMenu.bind(null, this.props.track)}>
          <div className="artwork-container">
            <div className="artwork" style={artworkStyle} />
          </div>
          <div className="info-container">
            <h5 className="title">{this.props.track.title} {this.renderDuration()}</h5>
            <h6 className="artist">{this.props.track.artist}</h6>
            {this.renderToggleCommentDisplay()}
          </div>
          {this.renderCollaboratorOptions()}
          {this.renderTrackSource()}
        </div>

        {this.renderTrackComments()}
      </li>
    );
  }

});

module.exports = React.createFactory(Track);
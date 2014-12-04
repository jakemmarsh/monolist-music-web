/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var _            = require('lodash');

var TrackActions = require('../actions/TrackActions');
var Comment      = require('./Comment');

var cx           = React.addons.classSet;

var CommentList = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    track: React.PropTypes.object,
    comments: React.PropTypes.array,
    shouldDisplay: React.PropTypes.bool
  },

  getDefaultPropTypes: function() {
    return {
      currentUser: {},
      shouldDisplay: false
    };
  },

  getInitialState: function() {
    return {
      newComment: ''
    };
  },

  stopPropagation: function(evt) {
    evt.stopPropagation();
  },

  handleKeyPress: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      this.postComment();
    }
  },

  postComment: function() {
    TrackActions.addComment(this.state.newComment, this.props.track, function() {
      this.setState({
        newComment: ''
      });
    }.bind(this));
  },

  renderComments: function() {
    var commentElements = _.chain(this.props.comments)
      .sortBy(function(comment) { return comment.createdAt; })
      .map(function(comment, index) {
        return (
          <Comment currentUser={this.props.currentUser}
                   track={this.props.track}
                   comment={comment}
                   key={index} />
        );
      }.bind(this));

    return commentElements;
  },

  renderCommentInput: function() {
    var element = null;

    if ( !_.isEmpty(this.props.currentUser) ) {
      element = (
        <li className="input-container">
          <input type="text"
                 valueLink={this.linkState('newComment')}
                 onKeyPress={this.handleKeyPress}
                 placeholder="Leave a comment..." />
        </li>
      );
    }

    return element;
  },

  render: function() {
    var classes = cx({
      'comments-container': true,
      'show': this.props.shouldDisplay
    });

    return (
      <ul className={classes} onClick={this.stopPropagation} onContextMenu={this.stopPropagation}>

        {this.renderComments()}

        {this.renderCommentInput()}

        <div className="shadow" />

      </ul>
    );
  }

});

module.exports = React.createFactory(CommentList);
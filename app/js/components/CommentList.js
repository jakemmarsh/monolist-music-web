/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var _            = require('underscore');

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
      shouldDisplay: false
    };
  },

  getInitialState: function() {
    return {
      newComment: '',
      comments: this.props.comments
    };
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
    var commentElements = _.chain(this.state.comments)
      .sortBy(function(comment) { return comment.createdAt; })
      .map(function(comment, index) {
      return (
        <Comment comment={comment} key={index} />
      );
    });

    return commentElements;
  },

  render: function() {
    var classes = cx({
      'comments-container': true,
      'show': this.props.shouldDisplay
    });

    return (
      <ul className={classes}>
        {this.renderComments()}
        <li className="input-container">
          <input type="text"
                 valueLink={this.linkState('newComment')}
                 onChange={this.updateNewComment}
                 onKeyPress={this.handleKeyPress}
                 placeholder="Leave a comment..." />
        </li>
      </ul>
    );
  }

});

module.exports = React.createFactory(CommentList);
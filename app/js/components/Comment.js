/**
 * @jsx React.DOM
 */
'use strict';

var React        = require('react/addons');
var Link         = React.createFactory(require('react-router').Link);
var moment       = require('moment');

var TrackActions = require('../actions/TrackActions');
var Avatar       = require('./Avatar');

var Comment = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    track: React.PropTypes.object,
    comment: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      track: {},
      comment: {
        user: {}
      }
    };
  },

  stopPropagation: function(evt) {
    evt.stopPropagation();
  },

  deleteComment: function() {
    TrackActions.removeComment(this.props.track.id, this.props.comment.id);
  },

  renderDeleteButton: function() {
    var element = null;

    if ( this.props.comment.userId === this.props.currentUser.id || this.props.currentUser.role === 'admin' ) {
      element = (
        <i className="fa fa-remove delete-button" onClick={this.deleteComment} />
      );
    }

    return element;
  },

  render: function() {
    return (
      <li className="comment">

        <div className="avatar-container">
          <Avatar user={this.props.comment.user} />
        </div>

        <div className="body-container">
          <div className="author">
            <Link to="Profile" params={{username: this.props.comment.user.username}} onClick={this.stopPropagation}>
              {this.props.comment.user.username}
            </Link>
          </div>
          <div className="body">
            {this.props.comment.body}
          </div>
          <span className="timestamp">
            {this.renderDeleteButton()}
            {moment(this.props.comment.createdAt).fromNow()}
          </span>
        </div>

      </li>
    );
  }

});

module.exports = React.createFactory(Comment);
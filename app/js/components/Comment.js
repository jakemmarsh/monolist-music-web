'use strict';

import React  from 'react/addons';
import {Link} from 'react-router';
import moment from 'moment';

import Avatar from './Avatar';

var Comment = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    track: React.PropTypes.object,
    comment: React.PropTypes.object.isRequired,
    deleteComment: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      currentUser: {},
      track: {},
      comment: {
        user: {}
      }
    };
  },

  stopPropagation(evt) {
    evt.stopPropagation();
  },

  deleteComment() {
    this.props.deleteComment(this.props.comment.id);
  },

  renderDeleteButton() {
    if ( this.props.comment.user.id === this.props.currentUser.id || this.props.currentUser.role === 'admin' ) {
      return (
        <i className="icon-remove delete-button" onClick={this.deleteComment} />
      );
    }
  },

  render() {
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

export default Comment;
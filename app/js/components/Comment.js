'use strict';

import React   from 'react/addons';
import {Link}  from 'react-router';
import moment  from 'moment';
import Linkify from 'react-linkify';

import Avatar  from './Avatar';

var Comment = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object,
    comment: React.PropTypes.object,
    deleteComment: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      currentUser: {},
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
        <i className="icon-close delete-button" onClick={this.deleteComment} />
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
            <Link to={`/profile/${this.props.comment.user.username}`} className="author-link" onClick={this.stopPropagation}>
              {this.props.comment.user.username}
            </Link>
          </div>
          <div className="body">
            <Linkify properties={{ 'target': '_blank' }}>
              {this.props.comment.body}
            </Linkify>
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
/**
 * @jsx React.DOM
 */
'use strict';

var React  = require('react/addons');
var Link   = React.createFactory(require('react-router').Link);
var moment = require('moment');

var Avatar = require('./Avatar');

var Comment = React.createClass({

  propTypes: {
    comment: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      comment: {
        user: {}
      }
    };
  },

  stopPropagation: function(evt) {
    evt.stopPropagation();
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
            <span className="timestamp">{moment(this.props.comment.createdAt).fromNow()}</span>
          </div>
        </li>
    );
  }

});

module.exports = React.createFactory(Comment);
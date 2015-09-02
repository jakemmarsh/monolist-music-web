'use strict';

import React               from 'react/addons';
import moment              from 'moment';

import NotificationHelpers from '../utils/NotificationHelpers';
import Avatar              from './avatar';

const Notification = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    notification: React.PropTypes.object.isRequired,
    key: React.PropTypes.number,
    navigateTo: React.PropTypes.func.isRequired,
    markAsRead: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      notification: {}
    };
  },

  getInitialState() {
    return {
      relatedEntity: {
        identifier: '',
        title: ''
      }
    };
  },

  handleLinkClick(url, evt) {
    if ( evt ) { evt.preventDefault(); }

    this.props.navigateTo(url);
  },

  markAsRead(evt) {
    if ( evt ) { evt.preventDefault(); }

    this.props.markAsRead(this.props.notification);
  },

  renderActorName() {
    let actor = this.props.notification.actor;
    let url = '/profile/' + actor.username;

    return (
      <a onClick={this.props.navigateTo.bind(null, url)}>
        {actor.username}
      </a>
    );
  },

  renderMarkAsReadButton() {
    if ( !this.props.notification.read ) {
      return (
        <i className="mark-read-button icon-circle-o"
           onClick={this.markAsRead}  />
      );
    }
  },

  renderDescription() {
    return NotificationHelpers.verbMap[this.props.notification.action];
  },

  renderEntityLink() {
    let notification = this.props.notification;
    let entity = notification.entity;
    let entityType = notification.entityType;
    let title = entity.title || entity.username || entity.id;
    let url = NotificationHelpers.entityPathMap[entityType] + notification.entityId;
    let shouldRenderLink = false;

    switch ( entityType ) {
      case 'playlist':
        shouldRenderLink = true;
        break;
      case 'track':
        shouldRenderLink = false;
        break;
      case 'group':
        shouldRenderLink = true;
        break;
      case 'user':
        if ( notification.entity.username === this.props.currentUser.username ) {
          shouldRenderLink = false;
          title = 'you';
        } else {
          shouldRenderLink = true;
        }
        break;
      case 'post':
      shouldRenderLink = true;
        title = 'a post';
        break;
      default:
        shouldRenderLink = false;
    }

    if ( shouldRenderLink ) {
      return (
        <a onClick={this.props.navigateTo.bind(null, url)}>{title}</a>
      );
    } else {
      return (
        <span>{title}</span>
      );
    }
  },

  render() {
    return (
      <li className="notification" key={this.props.key}>

        <div className="avatar-container">
          <Avatar user={this.props.notification.actor} includeLink={false} size={30} />
        </div>

        <div className="body-container">
          <div className="body">
            {this.renderActorName()} {this.renderDescription()} {this.renderEntityLink()}.
          </div>
          <div className="timestamp">
            {moment(this.props.notification.createdAt).fromNow()}
          </div>
        </div>

        {this.renderMarkAsReadButton()}

      </li>
    );
  }

});

export default Notification;
'use strict';

import React               from 'react';
import {History}           from 'react-router';
import cx                  from 'classnames';
import moment              from 'moment';

import NotificationHelpers from '../utils/NotificationHelpers';
import Avatar              from './Avatar';

const Notification = React.createClass({

  mixins: [History],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    notification: React.PropTypes.object.isRequired,
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
    evt.preventDefault();

    this.markAsRead();
    this.history.pushState(null, url);
  },

  markAsRead(evt) {
    if ( evt ) { evt.preventDefault(); }

    this.props.markAsRead(this.props.notification);
  },

  renderActorName() {
    const actor = this.props.notification.actor;
    const url = `/profile/${actor.username}`;

    return (
      <a href={url} onClick={this.handleLinkClick.bind(null, url)}>
        {actor.username}
      </a>
    );
  },

  renderMarkAsReadButton() {
    if ( !this.props.notification.read ) {
      return (
        <i ref="markAsReadButton"
           className="mark-read-button icon-circle-o"
           onClick={this.markAsRead}  />
      );
    }
  },

  renderDescription() {
    return NotificationHelpers.verbMap[this.props.notification.action];
  },

  renderEntityLink() {
    const notification = this.props.notification;
    const entity = notification.entity;
    const entityType = notification.entityType;
    const identifier = entity.slug || entity.username || entity.id;
    const url = NotificationHelpers.entityPathMap[entityType] + identifier;
    let title = entity.title || entity.username || entity.id;
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
        <a href={url} onClick={this.handleLinkClick.bind(null, url)}>{title}</a>
      );
    } else {
      return (
        <span>{title}</span>
      );
    }
  },

  render() {
    if ( !this.props.notification || !this.props.notification.entity ) {
      return (
        <noscript />
      );
    }

    const classes = cx('notification', {
      'unread': !this.props.notification.read
    });

    return (
      <li className={classes}>

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

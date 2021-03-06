'use strict';

import React              from 'react';
import {ListenerMixin}    from 'reflux';
import _                  from 'lodash';
import cx                 from 'classnames';

import GlobalActions      from '../actions/GlobalActions';
import NotificationsStore from '../stores/NotificationsStore';
import Notification       from './Notification';

const NotificationCenter = React.createClass({

  mixins: [ListenerMixin],

  interval: null,

  propTypes: {
    currentUser: React.PropTypes.object,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      currentUser: {},
      className: ''
    };
  },

  getInitialState() {
    return {
      notifications: [],
      showDropdown: false
    };
  },

  _onNotificationsChange(err, notifications) {
    if ( err ) {
      clearInterval(this.interval);
      this.setState({ error: err });
    } else {
      this.setState({
        notifications: notifications || [],
        error: null
      });
    }
  },

  componentDidUpdate(prevProps) {
    if ( !_.isEqual(this.props.currentUser, prevProps.currentUser) ) {
      clearInterval(this.interval);

      if ( !_.isEmpty(this.props.currentUser) ) {
        GlobalActions.loadUserNotifications();
      }
    }
  },

  componentDidMount() {
    this.listenTo(NotificationsStore, this._onNotificationsChange);
    GlobalActions.loadUserNotifications();
    // Poll for new notifications every 60 seconds
    this.interval = setInterval(GlobalActions.loadUserNotifications, 60000);
  },

  componentWillUnmount() {
    window.clearInterval(this.interval);
    document.removeEventListener('click', this.toggleDropdown);
  },

  toggleDropdown(evt) {
    evt.preventDefault();

    this.setState({
      showDropdown: !this.state.showDropdown
    }, () => {
      if ( this.state.showDropdown ) {
        document.addEventListener('click', this.toggleDropdown);
      } else {
        document.removeEventListener('click', this.toggleDropdown);
      }
    });
  },

  getNumNew() {
    return _.filter(this.state.notifications, notification => {
      return notification.read === false;
    }).length;
  },

  markAsRead(notification) {
    GlobalActions.markNotificationsAsRead(notification.id);
  },

  markAllAsRead(evt) {
    const ids = _.map(this.state.notifications, 'id');

    if ( evt ) { evt.preventDefault(); }

    GlobalActions.markNotificationsAsRead(ids);
  },

  renderMarkAllAsReadOption() {
    if ( this.state.notifications && this.state.notifications.length ) {
      return (
        <a className="mark-all-read" onClick={this.markAllAsRead}>Mark all as read</a>
      );
    }
  },

  renderNotifications() {
    if ( !this.state.notifications || !this.state.notifications.length ) {
      return (
        <div className="text-center soft-half--ends">No new notifications.</div>
      );
    }

    return _.map(this.state.notifications, (notification, index) => {
      return (
        <Notification notification={notification}
                      currentUser={this.props.currentUser}
                      key={index}
                      markAsRead={this.markAsRead} />
      );
    });
  },

  renderDropdown() {
    if ( !_.isEmpty(this.props.currentUser) && this.state.showDropdown ) {
      return (
        <div className="notification-dropdown">
          <div className="notifications-header table full-width">
            <div className="td half-width">
              <h6 className="title flush">Notifications</h6>
            </div>
            <div className="td half-width text-right">
              {this.renderMarkAllAsReadOption()}
            </div>
          </div>
          {this.renderNotifications()}
        </div>
      );
    }
  },

  renderBadge() {
    const numNew = this.getNumNew();

    if ( numNew > 0 ) {
      return (
        <div className="notification-center-new-notifications-indicator">
          {numNew}
        </div>
      );
    }
  },

  render() {
    const classes = cx('notification-center', {
      active: this.state.showDropdown,
      [this.props.className]: !!this.props.className
    });

    return (
      <div className={classes} onClick={this.toggleDropdown} ref="notificationsToggle">
        <i className="icon-bullhorn" />
        {this.renderBadge()}
        {this.renderDropdown()}
      </div>
    );
  }

});

export default NotificationCenter;

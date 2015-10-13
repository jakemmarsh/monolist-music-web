'use strict';

import React              from 'react/addons';
import {ListenerMixin}    from 'reflux';
import _                  from 'lodash';
import $                  from 'jquery';
import cx                 from 'classnames';

import GlobalActions      from '../actions/GlobalActions';
import NotificationsStore from '../stores/NotificationsStore';
import Notification       from './Notification';

var NotificationCenter = React.createClass({

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
      this.setState({ error: err.message });
    } else {
      this.setState({
        notifications: notifications || [],
        error: null
      });
    }
  },

  componentDidUpdate(prevProps) {
    if ( _.isEmpty(this.props.currentUser) ) {
      clearInterval(this.interval);
    } else if ( !_.isEqual(this.props.currentUser, prevProps.currentUser) ) {
      GlobalActions.loadUserNotifications();
    }
  },

  componentDidMount() {
    this.listenTo(NotificationsStore, this._onNotificationsChange);
    GlobalActions.loadUserNotifications();
    // Poll for new notifications every 60 seconds
    this.interval = setInterval(GlobalActions.loadUserNotifications, 60000);
  },

  componentWillUnmount() {
    clearInterval(this.interval);
    $(document).off('click', this.toggleDropdown);
  },

  toggleDropdown(evt) {
    evt.preventDefault();

    this.setState({
      showDropdown: !this.state.showDropdown
    }, () => {
      if ( this.state.showDropdown ) {
        $(document).on('click', this.toggleDropdown);
      } else {
        $(document).off('click', this.toggleDropdown);
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
    let ids = _.pluck(this.state.notifications, 'id');

    if ( evt ) { evt.preventDefault(); }

    GlobalActions.markNotificationsAsRead(ids);
  },

  renderNotifications() {
    if ( !_.isEmpty(this.props.currentUser) && this.state.showDropdown ) {
      return (
        <div className="notification-dropdown">
          <div className="notifications-header table full-width">
            <div className="td half-width">
              <h6 className="title flush">Notifications</h6>
            </div>
            <div className="td half-width text-right">
              <a className="mark-all-read" onClick={this.markAllAsRead}>Mark all as read</a>
            </div>
          </div>
          {_.map(this.state.notifications, (notification, index) => {
            return (
              <Notification notification={notification}
                            currentUser={this.props.currentUser}
                            key={index}
                            markAsRead={this.markAsRead} />
            );
          })
          }
        </div>
      );
    }
  },

  render() {
    let numNew = this.getNumNew();
    let classes = {
      'notification-center': true,
      'has-new': numNew > 0
    };

    classes[this.props.className] = true;

    return (
      <div className={cx(classes)} onClick={this.toggleDropdown} ref="notificationsToggle">
        {numNew}
        {this.renderNotifications()}
      </div>
    );
  }

});

export default NotificationCenter;
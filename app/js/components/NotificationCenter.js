'use strict';

import React              from 'react/addons';
import {ListenerMixin}    from 'reflux';
import _                  from 'lodash';
import $                  from 'jquery';
import cx                 from 'classnames';

import GlobalActions      from '../actions/GlobalActions';
import NotificationsStore from '../stores/NotificationsStore';

var NotificationCenter = React.createClass({

  mixins: [ListenerMixin],

  interval: null,

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    showContextMenu: React.PropTypes.func,
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
      notifications: []
    };
  },

  _onNotificationsChange(err, notifications) {
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      this.setState({ notifications: notifications || [], error: null });
    }
  },

  componentDidUpdate(prevProps) {
    if ( !_.isEmpty(this.props.currentUser) && !_.isEqual(this.props.currentUser, prevProps.currentUser) ) {
      GlobalActions.loadUserNotifications(this._onNotificationsChange);
    }
  },

  componentDidMount() {
    this.listenTo(NotificationsStore, this._onNotificationsChange);
    GlobalActions.loadUserNotifications();
    // Poll for new notifications every 20 seconds
    this.interval = setInterval(GlobalActions.loadUserNotifications, 20000);
  },

  componentWillUnmount() {
    clearInterval(this.interval);
  },

  getNumNew() {
    return _.filter(this.state.notifications, function(notification) {
      return notification.read === false;
    }).length;
  },

  markAsRead(notification) {
    let notificationsCopy = this.state.notifications;
    let id = notification.id;

    _.each(notificationsCopy, item => {
      if ( item.id === id ) {
        item.read = true;
      }
    });

    this.setState({ notifications: notificationsCopy }, GlobalActions.markNotificationsAsRead.bind(null, id));
  },

  markAllAsRead() {
    let notificationsCopy = this.state.notifications;
    let ids = [];

    _.each(notificationsCopy, notification => {
      ids.push(notification.id);
      notification.read = true;
    });

    this.setState({ notifications: notificationsCopy }, GlobalActions.markNotificationsAsRead.bind(null, ids));
  },

  showNotifications(evt) {
    // TODO: figure out how to use <Link /> component instead of <a />, currently bug with this.context
    let menuItems = (
      <div>
        notifications
      </div>
    );
    let $notificationsToggle = $(this.refs.notificationsToggle.getDOMNode());
    let width = $notificationsToggle.outerWidth(true);
    let top = $notificationsToggle.offset().top + $notificationsToggle.outerHeight(true);
    let left = $notificationsToggle.offset().left;

    evt.stopPropagation();
    evt.preventDefault();

    evt.pageX = left;
    evt.pageY = top;

    this.props.showContextMenu(evt, menuItems, width);
  },

  render() {
    let numNew = this.getNumNew();
    let classes = {
      'notification-center': true,
      'has-new': numNew > 0
    };

    classes[this.props.className] = true;

    return (
      <div className={cx(classes)} onClick={this.showNotifications} ref="notificationsToggle">
        {numNew}
      </div>
    );
  }

});

export default NotificationCenter;
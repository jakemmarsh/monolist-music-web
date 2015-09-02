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
    currentUser: React.PropTypes.object.isRequired,
    showContextMenu: React.PropTypes.func,
    className: React.PropTypes.string,
    navigateTo: React.PropTypes.func
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
      this.setState({
        notifications: notifications || [],
        error: null
      });
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
    // Poll for new notifications every 30 seconds
    this.interval = setInterval(GlobalActions.loadUserNotifications, 30000);
  },

  componentWillUnmount() {
    clearInterval(this.interval);
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

  showNotifications(evt) {
    // TODO: figure out how to use <Link /> component instead of <a />, currently bug with this.context
    let menuItems = (
      <div className="notification-dropdown-inner">
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
                          navigateTo={this.props.navigateTo}
                          markAsRead={this.markAsRead} />
          );
        })
        }
      </div>
    );
    let $notificationsToggle = $(this.refs.notificationsToggle.getDOMNode());
    let width = 350;
    let top = $notificationsToggle.offset().top + $notificationsToggle.height();
    let left = $notificationsToggle.offset().left - width + $notificationsToggle.width();

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
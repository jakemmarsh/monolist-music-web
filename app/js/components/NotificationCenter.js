/**
 * @jsx React.DOM
 */
'use strict';

var React              = require('react/addons');
var Reflux             = require('reflux');
var _                  = require('lodash');
var cx                 = React.addons.classSet;

var GlobalActions      = require('../actions/GlobalActions');
var NotificationsStore = require('../stores/NotificationsStore');

var Avatar = React.createClass({

  mixins: [Reflux.ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired,
    className: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      currentUser: {},
      className: ''
    };
  },

  getInitialState: function() {
    return {
      notifications: []
    };
  },

  _onNotificationsChange: function(err, notifications) {
    if ( err ) {
      this.setState({ error: err.message });
    } else {
      this.setState({ notifications: notifications || [], error: null });
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if ( !_.isEqual(this.props.currentUser, nextProps.currentUser) ) {
      GlobalActions.loadUserNotifications(this._onNotificationsChange);
    }
  },

  componentDidMount: function() {
    this.listenTo(NotificationsStore, this._onNotificationsChange);
  },

  getNumNew: function() {
    return _.filter(this.state.notifications, function(notification) {
      return notification.read === false;
    }).length;
  },

  showNotifications: function() {
    console.log('show notifications');
  },

  render: function() {
    var classes = {
      'notification-center': true,
      'has-new': this.getNumNew() > 0
    };

    classes[this.props.className] = true;

    return (
      <div className={cx(classes)} onClick={this.showNotifications}>
        {this.getNumNew()}
      </div>
    );
  }

});

module.exports = React.createFactory(Avatar);
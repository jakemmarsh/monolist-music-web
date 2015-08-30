'use strict';

import React                  from 'react/addons';
import moment                 from 'moment';

import NotificationVerbalizer from '../utils/NotificationVerbalizer';
import Avatar                 from './avatar';

const Notification = React.createClass({

  propTypes: {
    notification: React.PropTypes.object.isRequired,
    key: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      notification: {}
    };
  },

  render() {
    return (
      <li className="notification" key={this.props.key}>

        <div className="avatar-container">
          <Avatar user={this.props.notification.actor} includeLink={false} size={30} />
        </div>

        <div className="body-container">
        </div>

        <span className="timestamp">
          {moment(this.props.notification.createdAt).fromNow()}
        </span>

      </li>
    );
  }

});

export default Notification;
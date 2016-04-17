'use strict';

import React        from 'react';
import _            from 'lodash';

import GroupList from '../components/GroupList';

const ProfileGroupsPage = React.createClass({

  propTypes: {
    user: React.PropTypes.object
  },

  render() {
    if ( !_.isEmpty(this.props.user.groups) ) {
      return (
        <GroupList groups={this.props.user.groups} cardClassName="pure-u-1-2" />
      );
    } else {
      return (
        <h4 className="hard nudge--bottom light text-center">
          This user has not joined any groups yet!
        </h4>
      );
    }
  }

});

export default ProfileGroupsPage;

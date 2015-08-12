'use strict';

import React     from 'react/addons';
import _         from 'lodash';

import GroupCard from './GroupCard';

var GroupList = React.createClass({

  propTypes: {
    groups: React.PropTypes.array.isRequired,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      groups: []
    };
  },

  renderGroups() {
    let elements = null;

    if ( !_.isEmpty(this.props.groups) ) {
    elements = _.map(this.props.groups, (group, index) => {
      return (
        <GroupCard group={group} key={index} />
      );
    });
    } else {
      elements = (
        <h3 className="flush--top light">No groups yet!</h3>
      );
    }

    return elements;
  },

  render() {
    let classes = 'group-list';

    if ( this.props.className ) {
      classes += (' ' + this.props.className);
    }
    return (
      <ul className={classes}>

        {this.renderGroups()}

      </ul>
    );
  }

});

export default GroupList;
'use strict';

import React            from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import _                from 'lodash';
import {ListenerMixin}  from 'reflux';
import DocumentTitle    from 'react-document-title';

import Helpers          from '../utils/Helpers';
import GroupsStore      from '../stores/GroupsStore';
import GlobalActions    from '../actions/GlobalActions';
import Title            from '../components/Title';
import CreateNewCard    from '../components/CreateNewCard';
import GroupList        from '../components/GroupList';

const GroupsPage = React.createClass({

  mixins: [ListenerMixin, LinkedStateMixin],

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getInitialState() {
    return {
      groups: {
        user: [],
        trending: []
      },
      error: null,
      loading: true
    };
  },

  _onGroupsChange(err, groups) {
    if ( err ) {
      this.setState({
        loading: false,
        error: err
      });
    } else if ( groups ) {
      this.setState({
        loading: false,
        error: null,
        groups: groups
      });
    }
  },

  componentDidMount() {
    this.listenTo(GroupsStore, this._onGroupsChange);
    GlobalActions.loadGroups();
  },

  renderUserGroupsAndOptions() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <div className="nudge-half--bottom">
          <Title text="My Groups" icon="user" className="hard" />
          <GroupList firstItem={<CreateNewCard type="group" />} groups={this.state.groups.user} cardClassName="pure-u-1-3" />
        </div>
      );
    }
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Groups')}>
      <section className="content groups">

        {this.renderUserGroupsAndOptions()}

        <Title text="Trending Groups" icon="line-chart" />

        <GroupList groups={this.state.groups.trending} cardClassName="pure-u-1-3" />

      </section>
      </DocumentTitle>
    );
  }

});

export default GroupsPage;
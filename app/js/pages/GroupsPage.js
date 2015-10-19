'use strict';

import React            from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import _                from 'lodash';
import {ListenerMixin}  from 'reflux';
import {Link}           from 'react-router';
import DocumentTitle    from 'react-document-title';

import Helpers          from '../utils/Helpers';
import GroupsStore      from '../stores/GroupsStore';
import GlobalActions    from '../actions/GlobalActions';
import Title            from '../components/Title';
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
          <div className="pure-g">
            <div className="pure-u-5-6">
              <Title text="My Groups" icon="user" className="hard" />
            </div>
            <div className="pure-u-1-6 text-right">
              <Link className="btn text-center" to="/groups/create">
                <i className="icon-user-plus nudge-quarter--right" /> Create
              </Link>
            </div>
          </div>
          <GroupList groups={this.state.groups.user} />
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
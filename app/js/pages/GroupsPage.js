'use strict';

import React               from 'react';
import LinkedStateMixin    from 'react-addons-linked-state-mixin';
import {ListenerMixin}     from 'reflux';
import DocumentTitle       from 'react-document-title';

import Helpers             from '../utils/Helpers';
import TrendingGroupsStore from '../stores/TrendingGroupsStore';
import GlobalActions       from '../actions/GlobalActions';
import Title               from '../components/Title';
import GroupList           from '../components/GroupList';

const GroupsPage = React.createClass({

  mixins: [ListenerMixin, LinkedStateMixin],

  propTypes: {
    currentUser: React.PropTypes.object
  },

  getInitialState() {
    return {
      groups: [],
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
    } else {
      this.setState({
        loading: false,
        error: null,
        groups: groups || []
      });
    }
  },

  componentDidMount() {
    this.listenTo(TrendingGroupsStore, this._onGroupsChange);
    GlobalActions.loadGroups();
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Groups')}>
      <section className="content groups fx-4 ovy-a max-width-wrapper">

        <Title text="Trending Groups" icon="line-chart" />

        <GroupList groups={this.state.groups} cardClassName="pure-u-1-3" />

      </section>
      </DocumentTitle>
    );
  }

});

export default GroupsPage;

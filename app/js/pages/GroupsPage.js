'use strict';

import React              from 'react/addons';
import _                  from 'lodash';
import {ListenerMixin}    from 'reflux';
import {Navigation, Link} from 'react-router';
import DocumentTitle      from 'react-document-title';

import Helpers            from '../utils/Helpers';
import GroupsStore        from '../stores/GroupsStore';
import GlobalActions      from '../actions/GlobalActions';
import GroupActions       from '../actions/GroupActions';
import Title              from '../components/Title';
import GroupList          from '../components/GroupList';
import PageControlBar     from '../components/PageControlBar';

var GroupsPage = React.createClass({

  mixins: [Navigation, ListenerMixin, React.addons.LinkedStateMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
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
        error: err.message
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

  renderCreateGroupButton() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <Link className="btn text-center" to="CreateGroup">
          <i className="icon-user-plus" /> Create
        </Link>
      );
    }
  },

  renderUserGroups() {
    if ( !_.isEmpty(this.props.currentUser) ) {
      return (
        <div className="nudge-half--bottom">
          <Title text="My Groups" icon="user" />
          <GroupList groups={this.state.groups.user} />
        </div>
      );
    }
  },

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('Groups')}>
      <section className="content groups">

        <PageControlBar type="search" className="nudge-half--bottom">
          {this.renderCreateGroupButton()}
          <div className="search-container" />
          <div className="loading-container" />
          <div className="options-container" />
        </PageControlBar>

        {this.renderUserGroups()}

        <div className="title-container">
          <div className="icon-container">
            <i className="icon-line-chart"></i>
          </div>
          <h5 className="title">Trending Groups</h5>
        </div>

        <GroupList groups={this.state.groups.trending} cardClassName="pure-u-1-3" />

      </section>
      </DocumentTitle>
    );
  }

});

export default GroupsPage;
'use strict';

import React           from 'react/addons';
import _               from 'lodash';
import {ListenerMixin} from 'reflux';
import {Link}          from 'react-router';
import DocumentTitle   from 'react-document-title';

import APIUtils        from '../utils/APIUtils';
import GroupsStore     from '../stores/GroupsStore';
import GlobalActions   from '../actions/GlobalActions';

var GroupsPage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      groups: {},
      error: null,
      loading: true
    };
  },

  _onGroupsChange(err, group) {
    if ( err ) {
      this.setState({ loading: false, error: err.message });
    } else if ( group ) {
      this.setState({
        loading: false,
        error: null,
        group: group
      });
    }
  },

  componentDidMount() {
    this.listenTo(GroupsStore, this._onGroupsChange);
    GlobalActions.loadGroups();
  },

  componentDidUpdate(prevProps) {
    if ( !_.isEmpty(this.props.currentUser) && !_.isEqual(this.props.currentUser, prevProps.currentUser) ) {
      GlobalActions.loadGroups();
    }
  },

  render() {
    return (
      <DocumentTitle title={APIUtils.buildPageTitle('Groups')}>
      <section className="content groups">

        groups page

      </section>
      </DocumentTitle>
    );
  }

});

export default GroupsPage;
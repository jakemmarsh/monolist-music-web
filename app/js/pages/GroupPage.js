'use strict';

import React             from 'react/addons';
import {Link}            from 'react-router';
import DocumentTitle     from 'react-document-title';

import APIUtils          from '../utils/APIUtils';
import ViewingGroupStore from '../stores/ViewingGroupStore';
import GroupActions      from '../actions/GroupActions';

var GroupPage = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      group: {},
      error: null,
      loading: true
    };
  },

  _onViewingGroupChange(err, group) {
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
    this.listenTo(ViewingGroupStore, this._onViewingGroupChange);
    GroupActions.open(this.props.params.slug.toString());
  },

  render() {
    return (
      <DocumentTitle title={APIUtils.buildPageTitle(this.state.group.title)}>
      <section className="content group">

        group page

      </section>
      </DocumentTitle>
    );
  }

});

export default GroupPage;
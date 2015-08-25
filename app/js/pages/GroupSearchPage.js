'use strict';

import React            from 'react/addons';
import {ListenerMixin}  from 'reflux';
import _                from 'lodash';

import GroupSearchStore from '../stores/GroupSearchStore';
import GroupActions     from '../actions/GroupActions';
import GroupList        from '../components/GroupList';

var GroupFeedPage = React.createClass({

  mixins: [ListenerMixin],

  getInitialState() {
    return {
      searching: false,
      error: null,
      results: []
    };
  },

  _onResultsChange(err, results) {
    if ( err ) {
      this.setState({ error: err });
    } else {
      this.setState({
        searching: false,
        error: null,
        results: results || []
      });
    }
  },

  componentDidMount() {
    this.listenTo(GroupSearchStore, this._onResultsChange);

    if ( this.props.query.q ) {
      this.doSearch();
    }
  },

  componentDidUpdate(prevProps) {
    let haveNewQuery = this.props.query.q && prevProps.query.q !== this.props.query.q;

    if ( haveNewQuery ) {
      this.doSearch();
    }
  },

  doSearch() {
    this.setState({ searching: true }, GroupActions.search.bind(null, this.props.query.q));
  },

  render() {
    return (
      <div>

        <GroupList groups={this.state.results} />

      </div>
    );
  }

});

export default GroupFeedPage;
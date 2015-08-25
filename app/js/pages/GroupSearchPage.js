'use strict';

import React            from 'react/addons';
import _                from 'lodash';

import GroupSearchStore from '../stores/GroupSearchStore';
import GroupActions     from '../actions/GroupActions';
import GroupList        from '../components/GroupList';

var GroupFeedPage = React.createClass({

  getInitialState() {
    return {
      query: this.props.query.q ? this.props.query.q.replace(/(\+)|(%20)/gi, ' ') : '',
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
    if ( this.state.query.length ) { this.doSearch(); }
  },

  componentDidUpdate(prevProps) {
    let haveNewQuery = this.props.query.q && prevProps.query.q !== this.props.query.q;

    if ( haveNewQuery ) {
      this.setState({
        query: this.props.query.q
      }, this.doSearch);
    }
  },

  doSearch() {
    this.setState({ searching: true }, GroupActions.search.bind(null, this.state.query));
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
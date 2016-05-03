'use strict';

import React            from 'react';
import {ListenerMixin}  from 'reflux';
import _                from 'lodash';

import GroupSearchStore from '../stores/GroupSearchStore';
import SearchActions    from '../actions/SearchActions';
import GroupList        from '../components/GroupList';
import NoDataBlock      from '../components/NoDataBlock';

const GroupSearchPage = React.createClass({

  mixins: [ListenerMixin],

  propTypes: {
    location: React.PropTypes.object,
    setSearchState: React.PropTypes.func,
    isLoading: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      setSearchState: () => {}
    };
  },

  getInitialState() {
    return {
      results: [],
      searchCompleted: false
    };
  },

  _onResultsChange(err, results) {
    if ( err ) {
      this.props.setSearchState({
        error: err,
        loading: false
      });
    } else {
      this.setState({
        results: results || [],
        searchCompleted: true
      }, this.props.setSearchState.bind(null, {
        error: null,
        loading: false,
      }));
    }
  },

  componentDidMount() {
    this.listenTo(GroupSearchStore, this._onResultsChange);

    if ( this.props.location.query.q ) {
      this.doSearch();
    }
  },

  componentDidUpdate(prevProps) {
    const hasNewQuery = this.props.location.query.q && prevProps.location.query.q !== this.props.location.query.q;

    if ( hasNewQuery ) {
      this.doSearch();
    }
  },

  doSearch() {
    this.setState({ results: [] }, () => {
      this.props.setSearchState({
        error: null,
        loading: true
      });
      SearchActions.searchGroups(this.props.location.query.q);
    });
  },

  renderResults() {
    if ( !_.isEmpty(this.state.results) ) {
      return (
        <GroupList groups={this.state.results} cardClassName="pure-u-1-3" />
      );
    } else if ( this.state.searchCompleted ) {
      return (
        <NoDataBlock iconClass="icon-frown-o"
                     heading="No group results."
                     subheading="Maybe try a different query?" />
      );
    } else if ( !this.props.isLoading ) {
      return (
        <NoDataBlock iconClass="icon-search"
                     heading="Search for groups" />
      );
    }
  },

  render() {
    return (
      <div>

        {this.renderResults()}

      </div>
    );
  }

});

export default GroupSearchPage;

'use strict';

import React            from 'react';
import _                from 'lodash';

import RecentSearchItem from './RecentSearchItem';

const RecentSearchesList = React.createClass({

  propTypes: {
    type: React.PropTypes.string,
    searches: React.PropTypes.array
  },

  getDefaultProps() {
    return {
      searches: []
    };
  },

  getFilteredSearches() {
    const queries = [];
    const searches = [];

    _.each(this.props.searches, (search) => {
      if ( !_.contains(queries, search.query) && search.results.length > 0  ) {
        queries.push(search.query);
        searches.push(search);
      }
    });

    return searches;
  },

  renderSearches() {
    return _.map(this.getFilteredSearches(), (search, index) => {
      return (
        <RecentSearchItem search={search} type={this.props.type} key={index} />
      );
    });
  },

  render() {
    return (
      <ul className="recent-searches-list">

        {this.renderSearches()}

      </ul>
    );
  }

});

export default RecentSearchesList;

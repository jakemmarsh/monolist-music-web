'use strict';

import React        from 'react/addons';
import _            from 'lodash';

var RecentSearchesList = React.createClass({

  propTypes: {
    searches: React.PropTypes.array.isRequired
  },

  getDefaultProps() {
    return {
      searches: []
    };
  },

  renderSearches() {
    return _.map(this.props.searches, (search, index) => {
      return (
        <li className={this.props.cardClassName} key={index}>
          {search.query}
        </li>
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
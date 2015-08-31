'use strict';

import React    from 'react/addons';
import {Link}   from 'react-router';
import {pascal} from 'change-case';

const RecentSearchItem = React.createClass({

  propTypes: {
    search: React.PropTypes.object.isRequired,
    type: React.PropTypes.string.isRequired,
    key: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      search: {}
    };
  },

  render() {

    return (
      <li className="recent-search-item table full-width" key={this.props.key}>

        <div className="query-container td">
          <h6 classname="flush"><span className="light nudge-quarter--right">search:</span> "{this.props.search.query}"</h6>
        </div>

        <div className="results-count-container td text-center">
          <h5 className="flush text-center highlight">{this.props.search.results ? this.props.search.results.length : 0}</h5>
          Results
        </div>

        <Link to="PlaylistSearch" query={{ q: this.props.search.query }} />

      </li>
    );
  }

});

export default RecentSearchItem;
'use strict';

import React from 'react';

var SearchBar = React.createClass({

  propTypes: {
    valueLink: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    onKeyPress: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      placeholder: 'Search...'
    };
  },

  render() {
    return (
      <div className="search-bar">
        <div className="icon-container">
          <i className="icon-search" />
        </div>
        <input ref="input"
               type="text"
               valueLink={this.props.valueLink}
               onKeyPress={this.props.onKeyPress}
               placeholder={this.props.placeholder} />
      </div>
    );
  }

});

export default SearchBar;
'use strict';

import React from 'react';
import cx    from 'classnames';

const SearchBar = React.createClass({

  propTypes: {
    value: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onKeyPress: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    isDisabled: React.PropTypes.bool,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      placeholder: 'Search...'
    };
  },

  render() {
    const classes = cx('search-bar', {
      [this.props.className]: !!this.props.className
    });

    return (
      <div className={classes}>
        <div className="icon-container">
          <i className="icon-search" />
        </div>
        <input ref="input"
               type="text"
               value={this.props.value}
               onChange={this.props.onChange}
               onKeyPress={this.props.onKeyPress}
               placeholder={this.props.placeholder}
               disabled={!!this.props.isDisabled} />
      </div>
    );
  }

});

export default SearchBar;

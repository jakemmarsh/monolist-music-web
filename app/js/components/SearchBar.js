'use strict';

import React from 'react';
import cx    from 'classnames';

import Spinner from './Spinner';

const SearchBar = React.createClass({

  propTypes: {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onKeyPress: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    className: React.PropTypes.string,
    loading: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      placeholder: 'Search...'
    };
  },

  renderIcon() {
    let iconElement;

    if ( this.props.loading ) {
      iconElement = (
        <Spinner size={10} />
      );
    } else {
      iconElement = (
        <i className="icon-search" />
      );
    }

    return iconElement;
  },

  render() {
    const classes = cx('search-bar', {
      [this.props.className]: !!this.props.className
    });

    return (
      <div className={classes}>
        <div className="icon-container">
          {this.renderIcon()}
        </div>
        <input ref="input"
               type="text"
               value={this.props.value}
               onChange={this.props.onChange}
               onKeyPress={this.props.onKeyPress}
               placeholder={this.props.placeholder}
               disabled={this.props.disabled || this.props.loading} />
      </div>
    );
  }

});

export default SearchBar;

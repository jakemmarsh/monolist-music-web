'use strict';

import React from 'react/addons';
import cx    from 'classnames';
import $     from 'jquery';

var PrivacyLevelDropdown = React.createClass({

  propTypes: {
    privacyLevel: React.PropTypes.string,
    setPrivacyLevel: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      privacyLevel: 'public',
      setPrivacyLevel: function() {}
    };
  },

  getInitialState() {
    return {
      currentPrivacyLevel: this.props.privacyLevel,
      showDropdown: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if ( nextProps.privacyLevel !== this.state.currentPrivacyLevel ) {
      this.setState({ currentPrivacyLevel: nextProps.privacyLevel });
    }
  },

  toggleDropdown(evt) {
    evt.preventDefault();

    this.setState({
      showDropdown: !this.state.showDropdown
    }, () => {
      if ( this.state.showDropdown ) {
        $(document).on('click', this.toggleDropdown);
      } else {
        $(document).off('click', this.toggleDropdown);
      }
    });
  },

  setPrivacyLevel(privacyLevel, evt) {
    evt.stopPropagation();
    evt.preventDefault();

    this.setState({ currentPrivacyLevel: privacyLevel });
    this.props.setPrivacyLevel(privacyLevel);
  },

  renderDropdown() {
    const newPrivacyLevel = this.state.currentPrivacyLevel === 'public' ? 'private' : 'public';
    const iconClasses = cx({
      'icon-globe': newPrivacyLevel === 'public',
      'icon-lock': newPrivacyLevel === 'private'
    });

    if ( this.state.showDropdown ) {
      return (
        <ul className="privacy-level-dropdown" ref="optionsList">
          <li className="privacy-level-option" onClick={this.setPrivacyLevel.bind(null, newPrivacyLevel)}>
            <i className={iconClasses} />
          </li>
        </ul>
      );
    }
  },

  render() {
    const iconClasses = cx({
      'icon-globe': this.state.currentPrivacyLevel === 'public',
      'icon-lock': this.state.currentPrivacyLevel === 'private'
    });

    return (
      <div className="privacy-level-container">
        <div ref="dropdownToggle" className="privacy-level-toggle" onClick={this.toggleDropdown}>
          <i className={iconClasses} />
        </div>
        {this.renderDropdown()}
      </div>
    );
  }

});

export default PrivacyLevelDropdown;
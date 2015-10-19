'use strict';

import React    from 'react';
import ReactDOM from 'react-dom';
import _        from 'lodash';
import $        from 'jquery';

var TagInput = React.createClass({

  propTypes: {
    placeholder: React.PropTypes.string,
    limit: React.PropTypes.number
  },

  getDefaultProps() {
    return {
      limit: 3
    };
  },

  componentDidMount() {
    require('bootstrap-tokenfield')($);

    let $input = $(ReactDOM.findDOMNode(this));

    $input.tokenfield({
      limit: this.props.limit
    });

    // Prevent duplicate tags
    $input.on('tokenfield:createtoken', function (evt) {
      _.each(this.getTokens(), function(token) {
        if ( token === evt.attrs.value ) {
          evt.preventDefault();
        }
      });
    }.bind(this));
  },

  getTokens() {
    return _.map($(ReactDOM.findDOMNode(this)).tokenfield('getTokens'), function(token) {
      return token.value;
    });
  },

  render() {
    return (
      <input type="text" placeholder={this.props.placeholder} />
    );
  }

});

export default TagInput;
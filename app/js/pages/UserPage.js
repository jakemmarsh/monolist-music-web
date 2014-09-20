/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react');
var CreateStoreMixin = require('../mixins/CreateStoreMixin');
var UserStore        = require('../stores/UserStore');

var UserPage = React.createClass({

  mixins: [CreateStoreMixin([UserStore])],

  getStateFromStores: function(props) {
    // var user = UserStore.get(props.params.username);
    var user = {
      username: 'jakemmarsh'
    };

    return {
      user: user
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getStateFromStores(nextProps));
  },

  render: function() {
    return (
      <div>
        User Page for: {this.state.user.username}
      </div>
    );
  }

});

module.exports = UserPage;
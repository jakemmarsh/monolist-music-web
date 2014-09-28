/**
 * @jsx React.DOM
 */
'use strict';

var React            = require('react/addons');

var CreateStoreMixin = require('../mixins/CreateStoreMixin');
var UserStore        = require('../stores/UserStore');

var UserPage = React.createClass({

  mixins: [CreateStoreMixin([UserStore])],

  propTypes: {
    updateHeader: React.PropTypes.func.isRequired,
    playlist: React.PropTypes.object,
    currentTrack: React.PropTypes.object,
    selectTrack: React.PropTypes.func
  },

  getStateFromStore: function(props) {
    props = props || this.props;
    // var user = UserStore.get(props.params.username);
    var user = {
      username: 'jakemmarsh'
    };

    return {
      user: user,
      title: user.username
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState(this.getStateFromStore(nextProps));
  },

  componentDidMount: function() {
    this.props.updateHeader({
      title: this.state.title,
      icon: 'fa-user'
    });
  },

  render: function() {
    return (
      <section className="content profile">

        User Page for: {this.state.user.username}

      </section>
    );
  }

});

module.exports = UserPage;
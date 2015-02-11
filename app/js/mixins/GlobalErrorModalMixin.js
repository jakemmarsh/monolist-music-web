/**
 * @jsx React.DOM
 */
 /* global FB */
'use strict';

var React                 = require('react/addons');

var LayeredComponentMixin = require('./LayeredComponentMixin');
var Modal                 = require('../components/Modal');

var GlobalErrorModalMixin = {

  mixins: [LayeredComponentMixin],

  getInitialState: function() {
    return {
      showGlobalErrorModal: false,
      message: null
    };
  },

  showGlobalErrorModal: function(error) {
    this.setState({ showGlobalErrorModal: true, message: error || null });
  },

  hideGlobalErrorModal: function() {
    this.setState({ showGlobalErrorModal: false });
  },

  renderLayer: function() {
    var element = (<span />);

    if ( this.state.showGlobalErrorModal ) {
      element = (
        <Modal className="error" onRequestClose={this.hideGlobalErrorModal}>

          <p className="text-center">
            {this.state.message}
          </p>

        </Modal>
      );
    }

    return element;
  },

};

module.exports = GlobalErrorModalMixin;
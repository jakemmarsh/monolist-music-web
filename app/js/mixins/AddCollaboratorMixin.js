/**
 * @jsx React.DOM
 */
'use strict';

var React                 = require('react/addons');
var _                     = require('lodash');

var LayeredComponentMixin = require('./LayeredComponentMixin');
var Modal                 = require('../components/Modal');

var AddCollaboratorMixin = {

  mixins: [LayeredComponentMixin],

  getInitialState: function() {
    return {
      showCollaboratorModal: false
    };
  },

  toggleCollaboratorModal: function() {
    this.setState({ showCollaboratorModal: !this.state.showCollaboratorModal });
  },

  renderLayer: function() {
    var element = (<span />);

    if ( this.state.showCollaboratorModal ) {
      element = (
        <Modal className="share" onRequestClose={this.toggleCollaboratorModal}>

          Add Collaborators

        </Modal>
      );
    }

    return element;
  },

};

module.exports = AddCollaboratorMixin;
'use strict';

function CreateStoreMixin(stores) {

  var storeMixin = {
    getInitialState: function() {
      return this.getStateFromStores(this.props);
    },

    componentDidMount: function() {
      stores.forEach(function(store) {
        store.addChangeListener(this.handleStoresChanged);
      }.bind(this));

      this.setState(this.getStateFromStores(this.props));
    },

    componentWillUnmount: function() {
      stores.forEach(function(store) {
        store.removeChangeListener(this.handleStoresChanged);
      }.bind(this));
    },

    handleStoresChanged: function() {
      if ( this.isMounted() ) {
        this.setState(this.getStateFromStores(this.props));
      }
    }
  };

  return storeMixin;

}

module.exports = CreateStoreMixin;
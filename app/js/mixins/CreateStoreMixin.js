'use strict';

function CreateStoreMixin(stores) {

  var storeMixin = {
    getInitialState: function() {
      return this.getStateFromStores(this.props);
    },

    componentDidMount: function() {
      stores.forEach(function(store) {
        store.addChangeListener(this.handleStoresChanged);
      });

      this.setState(this.getStateFromStores(this.props));
    },

    componentWillUnmount: function() {
      stores.forEach(function(store) {
        store.removeChangeListener(this.handleStoresChanged);
      });
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
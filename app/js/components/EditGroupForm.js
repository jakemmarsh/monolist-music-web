'use strict';

import React   from 'react';

import Spinner from './Spinner';

const EditGroupForm = React.createClass({

  getInitialState() {
    return {
      error: null,
      loading: false
    };
  },

  handleSubmit(evt) {
    evt.preventDefault();
  },

  renderError() {
    if ( this.state.error ) {
      return (
        <div className="error-container nudge-half--ends text-center">
          {this.state.error}
        </div>
      );
    }
  },

  renderSpinner() {
    if ( this.state.loading ) {
      return (
        <div className="spinner-container text-center nudge-half--ends">
          <Spinner size={10} />
        </div>
      );
    }
  },

  render() {
    return (
      <form className="edit-group-form" onSubmit={this.handleSubmit}>

        <button type="submit" disabled={this.state.loading || this.formIsInvalid() ? 'true' : ''}>
          Save Changes
        </button>

      </form>
    );
  }

});

export default EditGroupForm;

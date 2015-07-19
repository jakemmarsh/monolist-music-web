'use strict';

import React         from 'react/addons';
import DocumentTitle from 'react-document-title';

var CreateGroupPage = React.createClass({

  propTypes: {
    currentUser: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      error: null,
      loading: false
    };
  },

  render() {
    return (
      <DocumentTitle title={APIUtils.buildPageTitle('Create a Group')}>
      <section className="content create-group">

        create a group page

      </section>
      </DocumentTitle>
    );
  }

});

export default CreateGroupPage;
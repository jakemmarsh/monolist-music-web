'use strict';

import React         from 'react';
import {Link}        from 'react-router';
import DocumentTitle from 'react-document-title';

import Helpers       from '../utils/Helpers';

const NotFoundPage = React.createClass({

  render() {
    return (
      <DocumentTitle title={Helpers.buildPageTitle('404: Page Not Found')}>
        <div className="soft--ends nudge--ends full-width">
          <div className="not-found-card card nudge--top island">
            <h1 className="flush--top giga text-center red">404</h1>
            <h5 className="text-center">
              That page could not be found. Try checking out the <Link to="/charts">Charts</Link>!
            </h5>
          </div>
        </div>
      </DocumentTitle>
    );
  }

});

export default NotFoundPage;

'use strict';

import React  from 'react/addons';

import Footer from './components/Footer';

var OuterApp = React.createClass({

  propTypes: {
    children: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <div className="outer-page">

        <div className="outer-header soft-half--ends">
          <img className="logo" src="//assets.monolist.co/app/images/logo.png" alt="Monolist logo" />
        </div>

        <div className="outer-wrapper soft--ends">
          {this.props.children}
        </div>

        <Footer shouldPosition={true} />

      </div>
    );
  }

});

export default OuterApp;
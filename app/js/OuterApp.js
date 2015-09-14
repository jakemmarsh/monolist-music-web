'use strict';

import React  from 'react/addons';

import Footer from './components/Footer';

var OuterApp = React.createClass({

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    query: React.PropTypes.object
  },

  renderChildren() {
    return this.props.children && React.cloneElement(this.props.children, {
      params: this.props.params,
      query: this.props.query
    });
  },

  render() {
    return (
      <div className="outer-page">

        <div className="outer-header soft-half--ends">
          <img className="logo" src="//assets.monolist.co/app/images/logo.png" alt="Monolist logo" />
        </div>

        <div className="outer-wrapper soft--ends">
          {this.renderChildren()}
        </div>

        <Footer shouldPosition={true} />

      </div>
    );
  }

});

export default OuterApp;
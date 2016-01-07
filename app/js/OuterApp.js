'use strict';

import React  from 'react';
import $      from 'jquery';

import Footer from './components/Footer';

var OuterApp = React.createClass({

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    query: React.PropTypes.object
  },

  getInitialState() {
    return {
      wrapperStyles: {}
    };
  },

  resizeBody() {
    const documentHeight = $(window).height();
    const headerHeight = this.$header.outerHeight();
    const footerHeight = this.$footer.outerHeight();

    this.setState({
      wrapperStyles: {
        minHeight: documentHeight - headerHeight - footerHeight
      }
    });
  },

  componentDidMount() {
    this.$header = $('.outer-header');
    this.$footer = $('footer');
    this.resizeBody();
    $(window).on('resize', this.resizeBody);
  },

  componentWillUnmount() {
    $(window).off('resize', this.resizeBody);
  },

  render() {
    return (
      <div className="outer-page">

        <div className="outer-header soft-half--ends">
          <img className="logo" src="//assets.monolist.co/app/images/logo.png" alt="Monolist logo" />
        </div>

        <div className="outer-wrapper soft--ends" style={this.state.wrapperStyles}>
          {this.props.children}
        </div>

        <Footer />

      </div>
    );
  }

});

export default OuterApp;
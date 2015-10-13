'use strict';

import React  from 'react/addons';
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

  _resizeBody() {
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
    this._resizeBody();
    $(window).on('resize', this._resizeBody);
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

        <div className="outer-wrapper soft--ends" style={this.state.wrapperStyles}>
          {this.renderChildren()}
        </div>

        <Footer />

      </div>
    );
  }

});

export default OuterApp;
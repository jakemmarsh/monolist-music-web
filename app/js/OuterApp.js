'use strict';

import React     from 'react';
import ReactDOM  from 'react-dom';

import Footer    from './components/Footer';

const OuterApp = React.createClass({

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
    const documentHeight = window.innerHeight;
    const headerHeight = this.refs.header.offsetHeight;
    const footerHeight = ReactDOM.findDOMNode(this.refs.footer).offsetHeight;

    this.setState({
      wrapperStyles: {
        minHeight: documentHeight - headerHeight - footerHeight
      }
    });
  },

  componentDidMount() {
    this.resizeBody();
    window.addEventListener('resize', this.resizeBody);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeBody);
  },

  render() {
    return (
      <div className="outer-page">

        <div ref="header" className="outer-header soft-half--ends">
          <img className="logo" src="//assets.monolist.co/app/images/logo.png" alt="Monolist logo" />
        </div>

        <div className="outer-wrapper soft--ends" style={this.state.wrapperStyles}>
          {this.props.children}
        </div>

        <Footer ref="footer" />

      </div>
    );
  }

});

export default OuterApp;

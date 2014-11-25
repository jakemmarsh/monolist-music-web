/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react/addons');
var $     = require('jquery');
var Link  = React.createFactory(require('react-router').Link);

var HomePage = React.createClass({

  componentDidMount: function() {
    var $header = $(this.refs.header.getDOMNode());
    var $hero = $(this.refs.hero.getDOMNode());
    var heroBottom = $hero.position().top + $hero.outerHeight(true);
    var currentScrollPosition;

    $(window).scroll(function() {
      currentScrollPosition = $(document).scrollTop();

      if ( currentScrollPosition > (heroBottom - 50) ) {
        $header.addClass('solid');
      } else {
        $header.removeClass('solid');
      }
    });
  },

  scrollToInfo: function() {
    var infoElement = this.refs.info.getDOMNode();

    $('html, body').animate({
        scrollTop: $(infoElement).offset().top
    }, 1500);
  },

  render: function() {
    return (
      <section className="home-page">

        <header ref="header">
          <div className="wrapper">
            <div className="logo-container">
              <img className="logo" src="../images/logo.png" alt="Monolist logo" />
            </div>
            <div className="user-options-container">
              <Link to="Login">Login</Link>
            </div>
          </div>
        </header>

        <div ref="hero" className="hero">
          <div className="hero-container wrapper">
            <h1 className="flush--top">Collaboratively create and build playlists</h1>
            <Link to="Register" className="btn large nudge-half--top">Sign Up</Link>
          </div>
          <div className="scroll-down-container" onClick={this.scrollToInfo}>
            <i className="fa fa-arrow-down" />
          </div>
          <div className="filter" />
        </div>

        <div ref="info" className="info-container">
          <div className="wrapper island" style={{ height: '1000px' }}>
          </div>
          <div className="shadow" />
        </div>

        <footer>
          <div className="wrapper">
          </div>
        </footer>

      </section>
    );
  }

});

module.exports = React.createFactory(HomePage);
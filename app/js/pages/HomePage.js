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
    var heroBottom = $hero.offset().top + $hero.outerHeight(true);
    var currentScrollPosition;

    $(window).scroll(function() {
      currentScrollPosition = $(document).scrollTop();

      if ( currentScrollPosition > (heroBottom - 85) ) { // 85px = height of header
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
              <div className="logo" />
            </div>
            <div className="user-options-container">
              <Link to="Login">Login</Link>
            </div>
          </div>
        </header>

        <div ref="hero" className="hero">
          <div className="hero-container wrapper">
            <h1 className="flush--top nudge-quarter--bottom">Build playlists with your friends</h1>
            <h3 className="flush--top light">Easily add songs from your favorite sources</h3>
            <Link to="Register" className="btn large nudge-half--top">Sign Up</Link>
          </div>
          <div className="scroll-down-container" onClick={this.scrollToInfo}>
            <i className="fa fa-arrow-down" />
          </div>
          <div className="filter" />
        </div>

        <div ref="info" className="info-container soft--ends">
          <div className="wrapper soft--ends">
            <div className="info-row nudge--bottom text-left">
              <div className="icon-container soft-half--bottom"><i className="fa fa-users" /></div>
              <div className="text-container soft--left soft-half--bottom">
                <h3 className="flush--top">Create playlists collaboratively</h3>
                <p className="flush--top">Once a playlist is created, the creator has the option of adding other users as 'collaborators'. All collaborators have the ability to add and remove tracks from the playlist, as well as provide feedback on tracks added by other collaborators through per-track upvotes, downvotes, and comments.</p>
              </div>
            </div>
            <div className="info-row nudge--ends text-right">
              <div className="text-container soft--right soft-half--ends">
                <h3 className="flush--top">Choose songs from multiple sources</h3>
                <p className="flush--top">When searching for songs and adding them to your playlists, you have multiple sources to choose from including YouTube, Soundcloud, and Bandcamp. This nearly guarantees that you'll be able to find any song that you have in mind!</p>
              </div>
              <div className="icon-container soft-half--ends"><i className="fa fa-plus" /></div>
            </div>
            <div className="info-row nudge--ends text-left">
              <div className="icon-container soft-half--ends"><i className="fa fa-compass" /></div>
              <div className="text-container soft--left soft-half--ends">
                <h3 className="flush--top">Discover new playlists and songs</h3>
                <p className="flush--top">At any time, you can search for new playlists by title or related tags. You can also view playlists that are 'Trending' to see what's popular right now. Lastly, you can also choose to 'Follow' both playlists and users. This ensures that you will receive updates any time a user creates a new playlist, or when new tracks are added to your favorite playlists!</p>
              </div>
            </div>
            <div className="text-center">
              <Link to="Register" className="btn large">Sign Up</Link>
            </div>
          </div>
          <div className="shadow" />
        </div>

        <footer className="soft-half--ends text-left">
          <div className="wrapper">
            Copyright &copy; {new Date().getFullYear()} Monolist
          </div>
        </footer>

      </section>
    );
  }

});

module.exports = React.createFactory(HomePage);
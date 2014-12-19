/**
 * @jsx React.DOM
 */
 /* global FB */
'use strict';

var React                 = require('react/addons');
var _                     = require('lodash');
var qs                    = require('querystring');
var slug                  = require('slug');

var LayeredComponentMixin = require('./LayeredComponentMixin');
var Modal                 = require('../components/Modal');

var ShareModalMixin = {

  mixins: [LayeredComponentMixin],

  getInitialState: function() {
    return {
      showShareModal: false
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if ( !_.isEmpty(nextProps.playlist) ) {
      this.playlistUrl = 'http://www.monolist.co/playlist/' + nextProps.playlist.slug;
    }
  },

  toggleShareModal: function() {
    this.setState({ showShareModal: !this.state.showShareModal });
  },

  buildTwitterUrl: function() {
    var url = 'https://twitter.com/intent/tweet?';
    var text = this.props.playlist.title;
    var tags = _.map(this.props.playlist.tags, function(tag) { return slug(tag); });
    var hashTags = _.union(tags, ['monolist']);
    var queryString = qs.stringify({
      text: text,
      hashtags: hashTags.join(','),
      url: this.playlistUrl
    });

    return url + queryString;
  },

  doFacebookShare: function() {
    FB.ui({
      method: 'share',
      href: this.playlistUrl,
    });
  },

  doTwitterShare: function() {
    var url = this.buildTwitterUrl();
    var width = 550;
    var height = 300;
    var left = (screen.width/2)-(width/2);
    var top = (screen.height/2)-(height/2);

    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + height + ',width=' + width + ',top=' + top + ',left=' + left
    );
  },

  doGooglePlusShare: function() {
    var url = 'https://plus.google.com/share?url=' + this.playlistUrl;
    var width = 600;
    var height = 600;
    var left = (screen.width/2)-(width/2);
    var top = (screen.height/2)-(height/2);

    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + height + ',width=' + width + ',top=' + top + ',left=' + left
    );
  },

  renderLayer: function() {
    var element = (<span />);

    if ( this.state.showShareModal ) {
      element = (
        <Modal className="share" onRequestClose={this.toggleShareModal}>

          <div className="button full zeta facebook nudge-half--bottom" onClick={this.doFacebookShare}>
            <i className="fa fa-facebook" />
          </div>

          <div className="button full zeta twitter nudge-half--bottom" onClick={this.doTwitterShare}>
            <i className="fa fa-twitter" />
          </div>

          <div className="button full zeta google" onClick={this.doGooglePlusShare}>
            <i className="fa fa-google-plus" />
          </div>

        </Modal>
      );
    }

    return element;
  },

};

module.exports = ShareModalMixin;
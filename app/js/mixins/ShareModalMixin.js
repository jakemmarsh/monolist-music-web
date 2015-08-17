 /* global FB */
'use strict';

import React                 from 'react/addons';
import _                     from 'lodash';
import qs                    from 'querystring';
import {pascal}              from 'change-case';

import LayeredComponentMixin from './LayeredComponentMixin';
import Modal                 from '../components/Modal';

var ShareModalMixin = {

  mixins: [LayeredComponentMixin],

  getInitialState() {
    return {
      showShareModal: false
    };
  },

  componentWillReceiveProps(nextProps) {
    if ( !_.isEmpty(nextProps.playlist) ) {
      this.playlistUrl = 'http://www.monolist.co/playlist/' + nextProps.playlist.slug;
    }
  },

  toggleShareModal() {
    this.setState({ showShareModal: !this.state.showShareModal });
  },

  buildTwitterUrl() {
    let url = 'https://twitter.com/intent/tweet?';
    let text = this.props.playlist.title;
    let tags = _.map(this.props.playlist.tags, (tag) => { return pascal(tag); });
    let hashTags = _.union(tags, ['monolist']);
    let queryString = qs.stringify({
      text: text,
      hashtags: hashTags.join(','),
      url: this.playlistUrl
    });

    return url + queryString;
  },

  doFacebookShare() {
    FB.ui({
      method: 'share',
      href: this.playlistUrl,
    });
  },

  doTwitterShare() {
    let url = this.buildTwitterUrl();
    let width = 550;
    let height = 300;
    let left = (screen.width/2)-(width/2);
    let top = (screen.height/2)-(height/2);

    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + height + ',width=' + width + ',top=' + top + ',left=' + left
    );
  },

  doGooglePlusShare() {
    let url = 'https://plus.google.com/share?url=' + this.playlistUrl;
    let width = 600;
    let height = 600;
    let left = (screen.width/2)-(width/2);
    let top = (screen.height/2)-(height/2);

    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + height + ',width=' + width + ',top=' + top + ',left=' + left
    );
  },

  renderLayer() {
    var element = (<span />);

    if ( this.state.showShareModal ) {
      element = (
        <Modal className="share" onRequestClose={this.toggleShareModal}>

          <div className="button full zeta facebook nudge-half--bottom" onClick={this.doFacebookShare}>
            <i className="icon-facebook" />
          </div>

          <div className="button full zeta twitter nudge-half--bottom" onClick={this.doTwitterShare}>
            <i className="icon-twitter" />
          </div>

          <div className="button full zeta google" onClick={this.doGooglePlusShare}>
            <i className="icon-google-plus" />
          </div>

        </Modal>
      );
    }

    return element;
  },

};

export default ShareModalMixin;
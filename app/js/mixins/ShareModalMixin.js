 /* global FB */
'use strict';

import React         from 'react';
import _             from 'lodash';
import qs            from 'querystring';
import {pascal}      from 'change-case';

import GlobalActions from '../actions/GlobalActions';

const ShareModalMixin = {

  componentWillReceiveProps(nextProps) {
    if ( !_.isEmpty(nextProps.playlist) ) {
      this.playlistUrl = 'http://www.monolist.co/playlist/' + nextProps.playlist.slug;
    }
  },

  buildTwitterUrl() {
    const url = 'https://twitter.com/intent/tweet?';
    const text = this.props.playlist.title;
    const tags = _.map(this.props.playlist.tags, (tag) => { return pascal(tag); });
    const hashTags = _.union(tags, ['Monolist']);
    const queryString = qs.stringify({
      text: text,
      hashtags: hashTags.join(','),
      url: this.playlistUrl
    });

    return url + queryString;
  },

  doFacebookShare() {
    FB.ui({
      method: 'share',
      href: this.playlistUrl
    });
  },

  doTwitterShare() {
    const url = this.buildTwitterUrl();
    const width = 550;
    const height = 300;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + height + ',width=' + width + ',top=' + top + ',left=' + left
    );
  },

  doGooglePlusShare() {
    const url = 'https://plus.google.com/share?url=' + this.playlistUrl;
    const width = 600;
    const height = 600;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);

    window.open(
      url,
      '',
      'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=' + height + ',width=' + width + ',top=' + top + ',left=' + left
    );
  },

  openShareModal() {
    GlobalActions.openModal('share',
      <div>
        <div className="button full zeta facebook nudge-half--bottom" onClick={this.doFacebookShare}>
          <i className="icon-facebook" />
        </div>

        <div className="button full zeta twitter nudge-half--bottom" onClick={this.doTwitterShare}>
          <i className="icon-twitter" />
        </div>

        <div className="button full zeta google" onClick={this.doGooglePlusShare}>
          <i className="icon-google-plus" />
        </div>
      </div>
    );
  }

};

export default ShareModalMixin;

 /* global FB */
'use strict';

import React    from 'react';
import _        from 'lodash';
import qs       from 'querystring';
import {pascal} from 'change-case';

import Title    from '../components/Title';

const ShareModal = React.createClass({

  propTypes: {
    playlist: React.PropTypes.object.isRequired
  },

  buildPlaylistUrl() {
    return `http://app.monolist.co/playlist/${this.props.playlist.slug}`;
  },

  buildTwitterUrl() {
    const url = 'https://twitter.com/intent/tweet?';
    const text = this.props.playlist.title;
    const tags = _.map(this.props.playlist.tags, (tag) => { return pascal(tag); });
    const hashTags = _.union(tags, ['Monolist']);
    const queryString = qs.stringify({
      text: text,
      hashtags: hashTags.join(','),
      url: this.buildPlaylistUrl()
    });

    return url + queryString;
  },

  doFacebookShare() {
    FB.ui({
      method: 'share',
      href: this.buildPlaylistUrl()
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
    const url = 'https://plus.google.com/share?url=' + this.buildPlaylistUrl();
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

  render() {
    return (
      <div>
        <Title icon="share-alt" text={`Share ${this.props.playlist.title}`} />

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

});

export default ShareModal;

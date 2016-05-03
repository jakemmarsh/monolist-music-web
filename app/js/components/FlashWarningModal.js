'use strict';

import React         from 'react';

import GlobalActions from '../actions/GlobalActions';
import Title         from './title';

const FlashWarningModal = React.createClass({
  render() {
    return (
      <div>
        <Title icon="exclamation" text="You don't have flash installed" className="flush--bottom" />
        <p className="flush--top nudge--bottom text-left">
          Since we play your favorite music from an array of sources, we can't always guarantee the music
          being in a compatible format. In order to be able to play all of your songs, Flash Player may be required.
          You can install it <a href="https://get.adobe.com/flashplayer/" target="_blank">here</a>.
        </p>
        <div className="text-right">
          <button type="button" className="btn" onClick={GlobalActions.closeModal}>
            Got it
          </button>
        </div>
      </div>
    );
  }
});

export default FlashWarningModal;

'use strict';

import React              from 'react';
import {ListenerMixin}    from 'reflux';

import GlobalLoadingStore from '../stores/GlobalLoadingStore';

const GlobalLoadingBar = React.createClass({

  mixins: [ListenerMixin],

  getInitialState() {
    return {
      progress: 0
    };
  },

  updateProgress(progress) {
    this.setState({
      progress: progress
    });
  },

  componentDidMount() {
    this.listenTo(GlobalLoadingStore, this.updateProgress);
  },

  getProgressPercentage() {
    const { progress } = this.state;
    let percentage;

    if ( progress < 0 ) {
      percentage = 0;
    } else if ( progress > 100 ) {
      percentage = 100;
    } else {
      percentage = progress;
    }

    return percentage;
  },

  render() {
    const translation = -100 + this.getProgressPercentage();
    const fillStyle = {
      transform: `translateX(${translation}%)`
    };

    return (
      <div className="global-loading-bar">
        <div ref="fill" className="global-loading-bar-fill" style={fillStyle} />
      </div>
    );
  }

});

export default GlobalLoadingBar;

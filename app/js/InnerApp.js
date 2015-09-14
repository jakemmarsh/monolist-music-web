'use strict';

import React               from 'react/addons';

import Header              from './components/Header';
import CurrentlyPlaying    from './components/CurrentlyPlaying';
import PlayerControlsMixin from './mixins/PlayerControlsMixin';
import ContextMenuMixin    from './mixins/ContextMenuMixin';
import NavigationSidebar   from './components/NavigationSidebar';
import Footer              from './components/Footer';

var InnerApp = React.createClass({

  mixins: [PlayerControlsMixin, ContextMenuMixin],

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    userLikes: React.PropTypes.array
  },

  renderChildren() {
    return this.props.children && React.cloneElement(this.props.children, {
      params: this.props.params,
      query: this.props.query,
      currentUser: this.props.currentUser,
      userCollaborations: this.props.userCollaborations,
      userLikes: this.props.userLikes,
      currentTrack: this.state.track,
      showContextMenu: this.showContextMenu
    });
  },

  render() {
    return (
      <div className="full-height">

        <Header currentUser={this.props.currentUser} showContextMenu={this.showContextMenu} />

        <CurrentlyPlaying ref="currentlyPlaying"
                          player={this.player}
                          audio={this.audio}
                          currentTrack={this.state.track}
                          paused={this.state.paused}
                          time={this.state.time}
                          duration={this.state.duration}
                          volume={this.state.volume}
                          repeat={this.state.repeat}
                          shuffle={this.state.shuffle}
                          nextTrack={this.nextTrack}
                          previousTrack={this.previousTrack}
                          togglePlay={this.togglePlay}
                          seekTrack={this.seekTrack}
                          updateVolume={this.updateVolume}
                          toggleRepeat={this.toggleRepeat}
                          toggleShuffle={this.toggleShuffle} />

        <div className="main-content-wrapper">
          <NavigationSidebar currentUser={this.props.currentUser} />
          {this.renderChildren()}
          <div className="shadow" />
        </div>

        <Footer currentUser={this.props.currentUser} />

        {this.renderContextMenu()}

      </div>
    );
  }

});

export default InnerApp;
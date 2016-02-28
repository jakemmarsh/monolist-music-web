'use strict';

import React                      from 'react';

import Header                     from './components/Header';
import CurrentlyPlaying           from './components/CurrentlyPlaying';
import PlayerControlsMixin        from './mixins/PlayerControlsMixin';
import LayeredComponentMixin      from './mixins/LayeredComponentMixin';
import GlobalActions              from './actions/GlobalActions';
import ContextMenuStore           from './stores/ContextMenuStore';
import GlobalActionIndicatorStore from './stores/GlobalActionIndicatorStore';
import ModalStore                 from './stores/ModalStore';
import NavigationSidebar          from './components/NavigationSidebar';
import GlobalActionIndicator      from './components/GlobalActionIndicator';
import DropdownMenu               from './components/DropdownMenu';
import Modal                      from './components/Modal';
import Title                      from './components/Title';

const InnerApp = React.createClass({

  // ListenerMixin is also required, but already included by PlayerControlsMixin
  mixins: [PlayerControlsMixin, LayeredComponentMixin],

  propTypes: {
    children: React.PropTypes.object,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    userCollaborations: React.PropTypes.array,
    userGroups: React.PropTypes.array,
    userLikes: React.PropTypes.array
  },

  getInitialState() {
    return {
      globalActionIndicator: null,
      modalClass: null,
      modalContents: null,
      contextMenuX: null,
      contextMenuY: null,
      contextMenuWidth: null,
      contextMenuContents: null
    };
  },

  _checkForFlash() {
    let hasFlash = false;

    try {
      const fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');

      if (fo) {
        hasFlash = true;
      }
    } catch (e) {
      if (navigator.mimeTypes
            && navigator.mimeTypes['application/x-shockwave-flash'] !== undefined
            && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
        hasFlash = true;
      }
    }

    if ( !hasFlash ) {
      GlobalActions.openModal('flash-warning-modal',
        <div>
          <Title icon="exclamation" text="You don't have flash installed" className="flush--bottom" />
          <p className="flush--ends">
            Since we play your favorite music from an array of sources, we can't always guarantee the music
            being in a compatible format. In order to be able to play all of your songs, Flash Player may be required.
            You can install it <a href="https://get.adobe.com/flashplayer/" target="_blank">here</a>.
          </p>
        </div>
      );
    }
  },

  _handleContextMenu(options) {
    this.setState({
      contextMenuX: options.x,
      contextMenuY: options.y,
      contextMenuWidth: options.width,
      contextMenuContents: options.contents
    });
  },

  _handleActionIndicator(isSuccess) {
    this.setState({ globalActionIndicator: isSuccess ? 'success' : 'failure' }, () => {
      setTimeout(() => {
        this.setState({ globalActionIndicator: null });
      }, 2000);
    });
  },

  _handleModal(modalClass, modalContents) {
    this.setState({
      modalClass: modalClass,
      modalContents: modalContents
    });
  },

  componentDidMount() {
    this._checkForFlash();

    this.listenTo(ContextMenuStore, this._handleContextMenu);
    this.listenTo(GlobalActionIndicatorStore, this._handleActionIndicator);
    this.listenTo(ModalStore, this._handleModal);
  },

  renderContextMenu() {
    if ( this.state.contextMenuContents ) {
      return (
        <DropdownMenu left={this.state.contextMenuX} top={this.state.contextMenuY} width={this.state.contextMenuWidth}>
          {this.state.contextMenuContents}
        </DropdownMenu>
      );
    }
  },

  renderGlobalActionIndicator() {
    if ( this.state.globalActionIndicator ) {
      return (
        <GlobalActionIndicator isSuccess={this.state.globalActionIndicator === 'success'} />
      );
    }
  },

  renderLayer() {
    let element = (<span />);

    if ( this.state.modalContents ) {
      element = (
        <Modal className={this.state.modalClass}>
          {this.state.modalContents}
        </Modal>
      );
    }

    return element;
  },

  renderChildren() {
    return this.props.children && React.cloneElement(this.props.children, {
      params: this.props.params,
      query: this.props.query,
      currentUser: this.props.currentUser,
      currentTrack: this.state.track,
      userCollaborations: this.props.userCollaborations,
      userLikes: this.props.userLikes
    });
  },

  render() {
    return (
      <div className="d-f fxd-c h-1-1">

        <Header currentUser={this.props.currentUser} />

        <CurrentlyPlaying ref="currentlyPlaying"
                          currentUser={this.props.currentUser}
                          userCollaborations={this.props.userCollaborations}
                          player={this.player}
                          audio={this.audio}
                          currentTrack={this.state.track}
                          buffering={this.state.buffering}
                          paused={this.state.paused}
                          time={this.state.time}
                          duration={this.state.duration}
                          volume={this.state.volume}
                          repeat={this.state.repeat}
                          shuffle={this.state.shuffle} />

        <div className="main-content-wrapper d-f fxd-r fx-1" style={{ minHeight: 0 }}>
          <NavigationSidebar currentUser={this.props.currentUser}
                             userCollaborations={this.props.userCollaborations}
                             userGroups={this.props.userGroups} />

          {this.renderChildren()}
        </div>

        {this.renderContextMenu()}

        {this.renderGlobalActionIndicator()}

      </div>
    );
  }

});

export default InnerApp;
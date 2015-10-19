'use strict';

import ReactDOM from 'react-dom';

var LayeredComponentMixin = {

  componentWillUnmount() {
    this._unrenderLayer();
    document.body.removeChild(this._target);
  },

  componentDidUpdate() {
    this._renderLayer();
  },

  componentDidMount() {
    // Appending to the body is easier than managing the z-index of everything on the page.
    // It's also better for accessibility and makes stacking a snap (since components will stack
    // in mount order).
    this._target = document.createElement('div');
    document.body.appendChild(this._target);
    this._renderLayer();
  },

  _renderLayer() {
    // By calling this method in componentDidMount() and componentDidUpdate(), you're effectively
    // creating a "wormhole" that funnels React's hierarchical updates through to a DOM node on an
    // entirely different part of the page.
    ReactDOM.render(this.renderLayer(), this._target);
  },

  _unrenderLayer() {
    ReactDOM.unmountComponentAtNode(this._target);
  }

};

export default LayeredComponentMixin;
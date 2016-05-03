'use strict';

import ReactDOM from 'react-dom';
import _        from 'lodash';

const LabelHighlightMixin = {
  inputs: [],

  _handleInputFocus(input) {
    this.setState({ focusedInput: input.getAttribute('id') });
  },

  _handleInputBlur() {
    this.setState({ focusedInput: null });
  },

  componentDidMount() {
    this._findInputs();
    this._createInputFocusListeners();
  },

  componentDidUpdate() {
    const previousNumInputs = this.inputs.length;

    this._findInputs();

    if ( this.inputs.length !== previousNumInputs ) {
      this._removeInputFocusListeners();
      this._createInputFocusListeners();
    }
  },

  componentWillUnmount() {
    this._removeInputFocusListeners();
  },

  _findInputs() {
    const root = ReactDOM.findDOMNode(this);
    const inputs = root.getElementsByTagName('input');
    const textareas = root.getElementsByTagName('textarea');
    const selects = root.getElementsByTagName('select');

    this.inputs = [];

    _.forOwn(inputs, (elem) => { this.inputs.push(elem); });
    _.forOwn(textareas, (elem) => { this.inputs.push(elem); });
    _.forOwn(selects, (elem) => { this.inputs.push(elem); });
  },

  _createInputFocusListeners() {
    _.forEach(this.inputs, (inputElem) => {
      if ( inputElem && inputElem.addEventListener ) {
        inputElem.addEventListener('focus', this._handleInputFocus.bind(this, inputElem));
        inputElem.addEventListener('blur', this._handleInputBlur);
      }
    });
  },

  _removeInputFocusListeners() {
    this.inputs.forEach((inputElem) => {
      if ( inputElem && inputElem.addEventListener ) {
        inputElem.removeEventListener('focus', this._handleInputFocus.bind(this, inputElem));
        inputElem.removeEventListener('blur', this._handleInputBlur);
      }
    });
  }
};

export default LabelHighlightMixin;

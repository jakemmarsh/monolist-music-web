'use strict';

import ReactDOM from 'react-dom';
import _        from 'lodash';

export default function() {

  const LabelHighlightMixin = {
    _handleInputFocus(input) {
      this.setState({ focusedInput: input.getAttribute('id') });
    },

    _handleInputBlur() {
      this.setState({ focusedInput: null });
    },

    componentDidMount() {
      this._createInputFocusListeners();
    },

    componentDidUpdate() {
      this._removeInputFocusListeners();
      this._createInputFocusListeners();
    },

    componentWillUnmount() {
      this._removeInputFocusListeners();
    },

    _createInputFocusListeners() {
      const root = ReactDOM.findDOMNode(this);
      const inputs = root.getElementsByTagName('input');
      const textareas = root.getElementsByTagName('textarea');
      const selects = root.getElementsByTagName('select');

      this.inputs = [];
      _.forOwn(inputs, (elem) => { this.inputs.push(elem); });
      _.forOwn(textareas, (elem) => { this.inputs.push(elem); });
      _.forOwn(selects, (elem) => { this.inputs.push(elem); });

      _.forEach(this.inputs, (inputElem) => {
        inputElem.addEventListener('focus', this._handleInputFocus.bind(this, inputElem));
        inputElem.addEventListener('blur', this._handleInputBlur);
      });
    },

    _removeInputFocusListeners() {
      this.inputs.forEach((inputElem) => {
        inputElem.removeEventListener('focus', this._handleInputFocus.bind(this, inputElem));
        inputElem.removeEventListener('blur', this._handleInputBlur);
      });
    }
  };

  return LabelHighlightMixin;

}

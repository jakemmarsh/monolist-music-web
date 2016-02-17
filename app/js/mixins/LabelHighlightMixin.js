'use strict';

import ReactDOM from 'react-dom';
import _        from 'lodash';

export default function() {

  const LabelHighlightMixin = {
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
      _.forOwn(inputs, (elem) => { this.inputs.push(elem); })
      _.forOwn(textareas, (elem) => { this.inputs.push(elem); })
      _.forOwn(selects, (elem) => { this.inputs.push(elem); })

      _.forEach(this.inputs, (inputElem) => {
        inputElem.addEventListener('focus', () => {
          this.setState({ focusedInput: inputElem.getAttribute('id') });
        });

        inputElem.addEventListener('blur', () => {
          this.setState({ focusedInput: null });
        });
      });
    },

    _removeInputFocusListeners() {
      this.inputs.forEach((inputElem) => {
        inputElem.removeEventListener('focus');
        inputElem.removeEventListener('blur');
      });
    }
  };

  return LabelHighlightMixin;

}

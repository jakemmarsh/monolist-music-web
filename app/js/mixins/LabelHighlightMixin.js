'use strict';

import $ from 'jquery';

export default function(inputSelector) {

  const LabelHighlightMixin = {
    componentDidMount() {
      this._createInputFocusListeners();
    },

    componentWillUnmount() {
      this._removeInputFocusListeners();
    },

    _createInputFocusListeners() {
      const component = this;

      $(inputSelector).on('focus', function() {
        component.setState({ focusedInput: $(this).attr('id') });
      });

      $(inputSelector).on('blur', function() {
        component.setState({ focusedInput: null });
      });
    },

    _removeInputFocusListeners() {
      $(inputSelector).off('focus');
      $(inputSelector).off('blur');
    }
  };

  return LabelHighlightMixin;

}

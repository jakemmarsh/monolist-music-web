'use strict';

import React        from 'react';
import ReactDOM     from 'react-dom';
import TestUtils    from 'react-addons-test-utils';

import ActionButton from '../../app/js/components/ActionButton';

describe('Component: ActionButton', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <ActionButton {...props} />
    );
  }

  beforeEach(function() {
    props = {
      onClick: sandbox.stub(),
      icon: 'play'
    };
  });

  it('should call props.onClick on click', function() {
    renderComponent();
    const button = ReactDOM.findDOMNode(rendered);

    TestUtils.Simulate.click(button);

    sinon.assert.calledOnce(props.onClick);
  });

  it('should render the icon with the correct class', function() {
    renderComponent();

    assert.isTrue(rendered.refs.icon.classList.contains('icon-play'));
  });

  context('with className property', function() {
    beforeEach(function() {
      props.className = 'test-class';
      renderComponent();
    });

    it('should render the element with the class', function() {
      const button = ReactDOM.findDOMNode(rendered);

      assert.isTrue(button.classList.contains('test-class'));
    });
  });

  context('with tooltip property', function() {
    beforeEach(function() {
      props.tooltip = 'test tooltip content';
      renderComponent();
    });

    it('should render the tooltip on mouseEnter and hide on mouseLeave', function() {
      const button = ReactDOM.findDOMNode(rendered);

      assert.isUndefined(rendered.refs.tooltip);

      TestUtils.Simulate.mouseEnter(button);

      assert.isDefined(rendered.refs.tooltip);
      assert.strictEqual(rendered.refs.tooltip.textContent, props.tooltip);

      TestUtils.Simulate.mouseLeave(button);

      assert.isUndefined(rendered.refs.tooltip);
    });
  });

});

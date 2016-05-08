'use strict';

import React        from 'react';
import TestUtils    from 'react-addons-test-utils';
import {Link}       from 'react-router';

import ListLink from '../../app/js/components/ListLink';

describe('Component: ListLink', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <ListLink {...props} />
    );
  }

  function itShouldRenderTheLink() {
    it('should render the link', function() {
      const link = TestUtils.findRenderedComponentWithType(rendered, Link);

      assert.strictEqual(link.props.to, props.to);
      assert.strictEqual(link.props.query, props.query);
    });
  }

  beforeEach(function() {
    props = {
      query: {
        q: 'test'
      }
    };
  });

  context('when current path === props.to', function() {
    beforeEach(function() {
      props.to = '/my/page';
      sandbox.stub(ListLink.prototype, 'getCurrentPath').returns('/my/page');

      renderComponent();
    });

    itShouldRenderTheLink();

    it('should add the "active" class to the list item', function() {
      assert.isTrue(rendered.refs.listItem.classList.contains('active'));
    });
  });

  context('when current path !== props.to', function() {
    beforeEach(function() {
      props.to = '/my/page';
      sandbox.stub(ListLink.prototype, 'getCurrentPath').returns('/not/my/page');

      renderComponent();
    });

    itShouldRenderTheLink();

    it('should not add the "active" class to the list item', function() {
      assert.isFalse(rendered.refs.listItem.classList.contains('active'));
    });
  });

});

'use strict';

import React         from 'react';
import TestUtils     from 'react-addons-test-utils';

import CreateNewCard from '../../app/js/components/CreateNewCard';

describe('Component: CreateNewCard', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <CreateNewCard {...props} />
    );
  }

  beforeEach(function() {
    props = {};
  });

  context('when type is "playlist"', function() {
    beforeEach(function() {
      props.type = 'playlist';
      renderComponent();
    });

    it('renders the correct title', function() {
      assert.strictEqual(rendered.refs.title.textContent, 'Create New Playlist');
    });

    context('when provided props.onClick', function() {
      beforeEach(function() {
        props.onClick = sandbox.stub();

        renderComponent();
      });

      it('renders the trigger which calls props.onClick', function() {
        const trigger = rendered.refs.onClickTrigger;

        assert.isDefined(trigger);
        TestUtils.Simulate.click(trigger);

        sinon.assert.calledOnce(props.onClick);
      });

      it('does not render the link', function() {
        assert.isUndefined(rendered.refs.link);
      });
    });

    context('when not provided props.onClick', function() {
      beforeEach(function() {
        props.onClick = null;
      });

      it('renders the link with correct href', function() {
        const link = rendered.refs.link;

        assert.isDefined(link);
        assert.strictEqual(link.props.to, '/playlists/create');
      });

      it('does not render the trigger', function() {
        assert.isUndefined(rendered.refs.onClickTrigger);
      });
    });
  });

  context('when type is "group"', function() {
    beforeEach(function() {
      props.type = 'group';
      renderComponent();
    });

    it('renders the correct title', function() {
      assert.strictEqual(rendered.refs.title.textContent, 'Create New Group');
    });

    context('when provided props.onClick', function() {
      beforeEach(function() {
        props.onClick = sandbox.stub();

        renderComponent();
      });

      it('renders the trigger which calls props.onClick', function() {
        const trigger = rendered.refs.onClickTrigger;

        assert.isDefined(trigger);
        TestUtils.Simulate.click(trigger);

        sinon.assert.calledOnce(props.onClick);
      });

      it('does not render the link', function() {
        assert.isUndefined(rendered.refs.link);
      });
    });

    context('when not provided props.onClick', function() {
      beforeEach(function() {
        props.onClick = null;
      });

      it('renders the link with correct href', function() {
        const link = rendered.refs.link;

        assert.isDefined(link);
        assert.strictEqual(link.props.to, '/groups/create');
      });

      it('does not render the trigger', function() {
        assert.isUndefined(rendered.refs.onClickTrigger);
      });
    });
  });

});

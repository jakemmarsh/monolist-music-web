'use strict';

import React            from 'react';
import TestUtils        from 'react-addons-test-utils';

import testHelpers      from '../../utils/testHelpers';
import PostActions      from '../../app/js/actions/PostActions';
import PostPage         from '../../app/js/pages/PostPage';
import ViewingPostStore from '../../app/js/stores/ViewingPostStore';

describe('Page: Post', function() {

  const POST = testHelpers.fixtures.post;
  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <PostPage {...props} />
    );
  }

  beforeEach(function() {
    props = {
      params: {
        id: POST.id
      }
    };
    renderComponent();
  });

  describe('#componentDidMount', function() {
    it('should listen to HomePageStore and call load action', function() {
      sandbox.stub(rendered, 'listenTo');
      sandbox.stub(PostActions, 'open');

      rendered.componentDidMount();

      sinon.assert.calledOnce(rendered.listenTo);
      sinon.assert.calledWith(rendered.listenTo, ViewingPostStore, rendered._onPostChange);
      sinon.assert.calledOnce(PostActions.open);
    });
  });

});

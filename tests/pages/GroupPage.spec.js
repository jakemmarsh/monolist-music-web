'use strict';

import React                from 'react';
import TestUtils            from 'react-addons-test-utils';

import testHelpers          from '../../utils/testHelpers';
import copyObject           from '../../utils/copyObject';
import GroupPage            from '../../app/js/pages/GroupPage';
import GroupActions         from '../../app/js/actions/GroupActions';
import ViewingGroupStore    from '../../app/js/stores/ViewingGroupStore';
import ViewingPostListStore from '../../app/js/stores/ViewingPostListStore';

describe('Page: Group', function() {

  const group = copyObject(testHelpers.fixtures.group);
  const user = copyObject(testHelpers.fixtures.user);
  let rendered;
  let props;

  function renderComponent(done) {
    rendered = TestUtils.renderIntoDocument(
      <GroupPage {...props} />
    );

    rendered.setState({ group: copyObject(group) }, done);
  }

  beforeEach(function(done) {
    props = {
      params: {
        slug: group.slug
      }
    };

    renderComponent(done);
  });

  describe('#componentDidMount', function() {
    it('should listen to ViewingGroupStore and load group', function() {
      sandbox.stub(rendered, 'listenTo');
      sandbox.stub(GroupActions, 'open');

      rendered.componentDidMount();

      sinon.assert.calledTwice(rendered.listenTo);
      sinon.assert.calledWith(rendered.listenTo, ViewingGroupStore, rendered._onViewingGroupChange);
      sinon.assert.calledWith(rendered.listenTo, ViewingPostListStore, rendered._onPostsChange);
      sinon.assert.calledOnce(GroupActions.open);
      sinon.assert.calledWith(GroupActions.open, rendered.state.group.slug);
    });
  });

  it('_onViewingGroupChange should set.state.group and reload posts and playlists', function() {
    sandbox.stub(GroupActions, 'loadPosts');
    sandbox.stub(GroupActions, 'loadPlaylists');

    rendered._onViewingGroupChange(null, group);

    return Promise.resolve().then(() => {
      assert.deepEqual(rendered.state.group, group);
      sinon.assert.calledOnce(GroupActions.loadPosts);
      sinon.assert.calledOnce(GroupActions.loadPlaylists);
    });
  });

  it('should add a member when a user is selected', function() {
    sandbox.stub(GroupActions, 'addMember');

    rendered.addMember(user);

    sinon.assert.calledOnce(GroupActions.addMember);
    sinon.assert.calledWith(GroupActions.addMember, group.id, user);
  });

  it('should remove a member when user is deselected', function() {
    sandbox.stub(GroupActions, 'removeMember');

    rendered.removeMember(user);

    sinon.assert.calledOnce(GroupActions.removeMember);
    sinon.assert.calledWith(GroupActions.removeMember, group.id, user);
  });

});

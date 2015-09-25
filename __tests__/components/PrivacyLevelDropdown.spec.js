'use strict';

import React                from 'react/addons';
import $                    from 'jquery';

import TestHelpers          from '../../utils/testHelpers';
import PrivacyLevelDropdown from '../../app/js/components/PrivacyLevelDropdown';

const  TestUtils   = React.addons.TestUtils;

describe('Component: PrivacyLevelDropdown', function() {

  it('#componentWillReceiveProps will update state if a different privacyLevel is passed down', function() {
    const dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown privacyLevel="public" />
    );

    sandbox.mock(dropdown).expects('setState').withArgs({
      currentPrivacyLevel: 'private'
    });

    dropdown.componentWillReceiveProps({
      privacyLevel: 'private'
    });
  });

  it('#toggleDropdown should flip this.state.showDropdown and add a click listener to DOM if true', function() {
    const dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown />
    );

    sandbox.mock($(document)).expects('on').withArgs('click', dropdown.toggleDropdown);
    sandbox.mock(dropdown).expects('setState').withArgs({
      showDropdown: true
    });

    dropdown.toggleDropdown(TestHelpers.createNativeClickEvent());
  });

  it('#toggleDropdown should flip this.state.showDropdown and remove a click listener from DOM if false', function() {
    const dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown />
    );

    dropdown.setState({ showDropdown: true });
    sandbox.mock($(document)).expects('off').withArgs('click', dropdown.toggleDropdown);
    sandbox.mock(dropdown).expects('setState').withArgs({
      showDropdown: false
    });

    dropdown.toggleDropdown(TestHelpers.createNativeClickEvent());
  });

  it('#setPrivacyLevel should prevent any click events/propagation, set state and call props.setPrivacyLevel', function() {
    const propsSpy = sandbox.spy();
    const evt = {
      stopPropagation: sandbox.spy(),
      preventDefault: sandbox.spy()
    };
    const dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown setPrivacyLevel={propsSpy} />
    );
    const privacyLevel = 'private';

    sandbox.mock(dropdown).expects('setState').withArgs({
      currentPrivacyLevel: privacyLevel
    })

    dropdown.setPrivacyLevel(privacyLevel, evt);

    sinon.assert.calledWith(propsSpy, privacyLevel);
    sinon.assert.calledOnce(evt.stopPropagation);
    sinon.assert.calledOnce(evt.preventDefault);
  });

  it('#renderDropdown should only return an element if state.showDropdown is true', function() {
    const dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown />
    );

    Should(dropdown.renderDropdown()).be.undefined();

    dropdown.setState({ showDropdown: true });

    Should(dropdown.renderDropdown()).not.be.undefined();
  });

  it('#renderDropdown should render the dropdown with the correct icon and click event binding', function() {
    let dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown privacyLevel="public" />
    );
    let $icon;

    sandbox.mock(dropdown).expects('setPrivacyLevel').withArgs('private', sinon.match.any);

    dropdown.toggleDropdown(TestHelpers.createNativeClickEvent());
    $icon = $('i', dropdown.refs.optionsList.getDOMNode());
    $icon.hasClass('icon-lock').should.be.true();
    TestUtils.Simulate.click($icon);

    sandbox.restore();
    dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown privacyLevel="private" />
    );

    sandbox.mock(dropdown).expects('setPrivacyLevel').withArgs('public', sinon.match.any);

    dropdown.toggleDropdown(TestHelpers.createNativeClickEvent());
    $icon = $('i', dropdown.refs.optionsList.getDOMNode());
    $icon.hasClass('icon-globe').should.be.true();
    TestUtils.Simulate.click($icon);
  });

  it('#render should render the correct icon based on privacyLevel', function() {
    let dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown privacyLevel="public" />
    );
    let $icon = $('i', dropdown.refs.dropdownToggle.getDOMNode());
    $icon.hasClass('icon-globe').should.be.true();

    dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown privacyLevel="private" />
    );
    $icon = $('i', dropdown.refs.dropdownToggle.getDOMNode());
    $icon.hasClass('icon-lock').should.be.true();
  });

  it('clicking the toggle should call #toggleDropdown', function() {
    let dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown privacyLevel="public" />
    );
    let toggle = dropdown.refs.dropdownToggle.getDOMNode();

    sandbox.mock(dropdown).expects('toggleDropdown').once();
    TestUtils.Simulate.click(toggle);
  });

});
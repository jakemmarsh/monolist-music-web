'use strict';

import React                from 'react';
import ReactDOM             from 'react-dom';
import TestUtils            from 'react-addons-test-utils';
import $                    from 'jquery';

import TestHelpers          from '../../utils/testHelpers';
import PrivacyLevelDropdown from '../../app/js/components/PrivacyLevelDropdown';

describe('Component: PrivacyLevelDropdown', function() {

  it('#componentWillReceiveProps will update state if a different privacyLevel is passed down', function() {
    const dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown privacyLevel="public" userCanChange={true} />
    );

    sandbox.mock(dropdown).expects('setState').withArgs({
      currentPrivacyLevel: 'private'
    });

    dropdown.componentWillReceiveProps({
      privacyLevel: 'private'
    });
  });

  it('#componentWillUnmount should remove click listener from DOM', function() {
    const dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown />
    );

    sandbox.mock($(document)).expects('off').withArgs('click', dropdown.toggleDropdown);

    dropdown.componentWillUnmount();
  });

  it('#toggleDropdown should flip this.state.showDropdown and add a click listener to DOM if true', function() {
    const dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown userCanChange={true} />
    );

    sandbox.mock($(document)).expects('on').withArgs('click', dropdown.toggleDropdown);
    sandbox.mock(dropdown).expects('setState').withArgs({
      showDropdown: true
    });

    dropdown.toggleDropdown(TestHelpers.createNativeClickEvent());
  });

  it('#toggleDropdown should flip this.state.showDropdown and remove a click listener from DOM if false', function() {
    const dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown userCanChange={true} />
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
      <PrivacyLevelDropdown setPrivacyLevel={propsSpy} userCanChange={true} />
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
      <PrivacyLevelDropdown userCanChange={true} />
    );

    Should(dropdown.renderDropdown()).be.undefined();

    dropdown.setState({ showDropdown: true });

    Should(dropdown.renderDropdown()).not.be.undefined();
  });

  it.only('#renderDropdown should render the dropdown with the correct icon and click event binding', function() {
    let dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown privacyLevel="public" userCanChange={true} />
    );
    let setStateSpy = sandbox.spy(dropdown, 'setState');

    TestUtils.Simulate.click(dropdown.refs.dropdownToggle);
    $('i', dropdown.refs.optionsList).hasClass('icon-lock').should.be.true();
    TestUtils.Simulate.click(dropdown.refs.privacyOption);

    sinon.assert.calledWith(setStateSpy, { currentPrivacyLevel: 'private' });

    dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown privacyLevel="private" userCanChange={true} />
    );
    setStateSpy = sandbox.spy(dropdown, 'setState');

    TestUtils.Simulate.click(dropdown.refs.dropdownToggle);
    $('i', dropdown.refs.optionsList).hasClass('icon-globe').should.be.true();
    TestUtils.Simulate.click(dropdown.refs.privacyOption);

    sinon.assert.calledWith(setStateSpy, { currentPrivacyLevel: 'public' });
  });

  it('clicking the toggle should call #toggleDropdown', function() {
    let dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown privacyLevel="public" userCanChange={true} />
    );
    let toggle = dropdown.refs.dropdownToggle;

    sandbox.mock(dropdown).expects('toggleDropdown').once();
    TestUtils.Simulate.click(toggle);
  });

  it('should apply the class `static` to the container if user can\'t edit privacy level', function() {
    let dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown privacyLevel="public" userCanChange={false} />
    );

    $(ReactDOM.findDOMNode(dropdown)).hasClass('static').should.be.true();
  });

  it('should not take any actions on click if user can\'t edit privacy level', function() {
    let dropdown = TestUtils.renderIntoDocument(
      <PrivacyLevelDropdown privacyLevel="public" userCanChange={false} />
    );
    let toggle = dropdown.refs.dropdownToggle;

    sandbox.mock(dropdown).expects('toggleDropdown').never();
    TestUtils.Simulate.click(toggle);
  });

});
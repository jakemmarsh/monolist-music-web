'use strict';

import React              from 'react';
import TestUtils          from 'react-addons-test-utils';

import ForgotPasswordPage from '../../app/js/pages/ForgotPasswordPage';
import AuthAPI            from '../../app/js/utils/AuthAPI';

describe('Page: ForgotPassword', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <ForgotPasswordPage {...props} />
    );
  }

  beforeEach(function() {
    props = {};
    renderComponent();
  });

  it('#isFormInvalid should return true if no username has been entered', function() {
    rendered.isFormInvalid().should.be.true();
  });

  it('#isFormInvalid should return false if username has been entered', function() {
    const usernameInput = rendered.refs.usernameInput;

    TestUtils.Simulate.change(usernameInput, { target: { value: 'test' } });

    rendered.isFormInvalid().should.be.false();
  });

  it('should make request and update state on form submit', function() {
    const username = 'test';
    const spy = sandbox.spy(rendered, 'setState');

    sandbox.stub(AuthAPI, 'forgotPassword').resolves();
    rendered.setState({ username: username });

    TestUtils.Simulate.submit(rendered.refs.form);

    return Promise.resolve(() => {
      sinon.assert.calledOnce(AuthAPI.forgotPassword);
      sinon.assert.calledWith(AuthAPI.forgotPassword, username);
      sinon.assert.calledWith(spy, {
        emailSent: true,
        error: null,
        loading: false
      });
    });
  });

  it('#renderError should not return an element if state.error does not exist', function() {
    rendered.setState({ error: null });
    Should(rendered.renderError()).be.undefined();
  });

  it('#renderError should return an element if state.error exists', function() {
    rendered.setState({ error: 'Test error' });
    Should(rendered.renderError()).not.be.undefined();
  });

  it('#renderSpinner should not return an element if state.loading is false', function() {
    rendered.setState({ loading: false });
    Should(rendered.renderSpinner()).be.undefined();
  });

  it('#renderSpinner should return an element if state.loading is true', function() {
    rendered.setState({ loading: true });
    Should(rendered.renderSpinner()).not.be.undefined();
  });

  it('#renderForm should return a paragraph message if state.emailSent is true', function() {
    rendered.setState({ emailSent: true });
    TestUtils.findRenderedDOMComponentWithClass.bind(null, rendered, 'email-sent-message').should.not.throw();
  });

  it('#renderForm should return a form if state.emailSent is false', function() {
    rendered.setState({ emailSent: false });
    TestUtils.findRenderedDOMComponentWithTag.bind(null, rendered, 'form').should.not.throw();
  });

  it('#renderBackLink should not return an element if state.emailSent is true', function() {
    rendered.setState({ emailSent: true });
    Should(rendered.renderBackLink()).be.undefined();
  });

  it('#renderBackLink should return an element if state.emailSent is false', function() {
    rendered.setState({ emailSent: false });
    Should(rendered.renderBackLink()).not.be.undefined();
  });

});

'use strict';

import React             from 'react';
import TestUtils         from 'react-addons-test-utils';

import ResetPasswordPage from '../../app/js/pages/ResetPasswordPage';
import AuthAPI           from '../../app/js/utils/AuthAPI';

describe('Page: ResetPassword', function() {

  const userId = 1;
  const resetKey = 'abcdefg';
  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <ResetPasswordPage {...props} />
    );
  }

  beforeEach(function() {
    props = {
      params: {
        userId: userId,
        key: resetKey
      }
    };

    renderComponent();
  });

  it('#isFormInvalid should return true if no password has been entered', function() {
    rendered.isFormInvalid().should.be.true();
  });

  it('#isFormInvalid should return false if password has been entered and confirmed', function() {
    const passwordInput = rendered.refs.passwordInput;
    const confirmInput = rendered.refs.confirmInput;
    const newPassword  = 'test';

    TestUtils.Simulate.change(passwordInput, { target: { value: newPassword } });
    TestUtils.Simulate.change(confirmInput, { target: { value: newPassword } });

    rendered.isFormInvalid().should.be.false();
  });

  it('should make request and update state on form submit', function() {
    const passwordInput = rendered.refs.passwordInput;
    const confirmInput = rendered.refs.confirmInput;
    const password = 'test';

    sandbox.stub(AuthAPI, 'resetPassword').resolves();

    TestUtils.Simulate.change(passwordInput, { target: { value: password } });
    TestUtils.Simulate.change(confirmInput, { target: { value: password } });

    TestUtils.Simulate.submit(rendered.refs.form);

    return Promise.resolve().then(() => {
      assert.isTrue(rendered.state.passwordReset);
      assert.isNull(rendered.state.error);
      assert.isFalse(rendered.state.loading);

      sinon.assert.calledOnce(AuthAPI.resetPassword);
      sinon.assert.calledWith(AuthAPI.resetPassword, userId, resetKey, password);
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

  it('#renderForm should return a paragraph message if state.passwordReset is true', function() {
    rendered.setState({ passwordReset: true });
    TestUtils.findRenderedDOMComponentWithClass.bind(null, rendered, 'email-sent-message').should.not.throw();
  });

  it('#renderForm should return a form if state.passwordReset is false', function() {
    rendered.setState({ passwordReset: false });
    TestUtils.findRenderedDOMComponentWithTag.bind(null, rendered, 'form').should.not.throw();
  });

});

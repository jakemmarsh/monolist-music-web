'use strict';

import ReactDOM          from 'react-dom';
import TestUtils         from 'react-addons-test-utils';
import when              from 'when';

import TestHelpers       from '../../utils/testHelpers';
import ResetPasswordPage from '../../app/js/pages/ResetPasswordPage';
import AuthAPI           from '../../app/js/utils/AuthAPI';

describe('Page: ResetPassword', function() {

  this.timeout(5000);

  const userId = 1;
  const resetKey = 'abcdefg';

  beforeEach(function(done) {
    this.container = document.createElement('div');
    TestHelpers.testPage('/reset', { userId: userId, key: resetKey }, {}, {}, ResetPasswordPage, this.container, (component) => {
      this.page = component;
      done();
    });
  });

  it('should exist', function() {
    Should.exist(ReactDOM.findDOMNode(this.page));
  });

  it('#isFormInvalid should return true if no password has been entered', function() {
    this.page.isFormInvalid().should.be.true();
  });

  it('#isFormInvalid should return false if password has been entered and confirmed', function() {
    const passwordInput = this.page.refs.passwordInput;
    const confirmInput = this.page.refs.confirmInput;
    const newPassword  = 'test';

    TestUtils.Simulate.change(passwordInput, { target: { value: newPassword } });
    TestUtils.Simulate.change(confirmInput, { target: { value: newPassword } });

    this.page.isFormInvalid().should.be.false();
  });

  it('#handleSubmit should make request and update state', function(done) {
    const passwordInput = this.page.refs.passwordInput;
    const confirmInput = this.page.refs.confirmInput;
    const password = 'test';
    const spy = sandbox.spy(this.page, 'setState');

    sandbox.mock(AuthAPI).expects('resetPassword').withArgs(userId, resetKey, password).returns(when());
    TestUtils.Simulate.change(passwordInput, { target: { value: password } });
    TestUtils.Simulate.change(confirmInput, { target: { value: password } });

    this.page.handleSubmit(TestHelpers.createNativeClickEvent());

    // ensure promise has been resolved and state has been updated
    setTimeout(function() {
      sinon.assert.calledWith(spy, {
        passwordReset: true,
        error: null,
        loading: false
      });

      done();
    }, 200);
  });

  it('#renderError should not return an element if state.error does not exist', function() {
    this.page.setState({ error: null });
    Should(this.page.renderError()).be.undefined();
  });

  it('#renderError should return an element if state.error exists', function() {
    this.page.setState({ error: 'Test error' });
    Should(this.page.renderError()).not.be.undefined();
  });

  it('#renderSpinner should not return an element if state.loading is false', function() {
    this.page.setState({ loading: false });
    Should(this.page.renderSpinner()).be.undefined();
  });

  it('#renderSpinner should return an element if state.loading is true', function() {
    this.page.setState({ loading: true });
    Should(this.page.renderSpinner()).not.be.undefined();
  });

  it('#renderForm should return a paragraph message if state.passwordReset is true', function() {
    this.page.setState({ passwordReset: true });
    TestUtils.findRenderedDOMComponentWithClass.bind(null, this.page, 'email-sent-message').should.not.throw();
  });

  it('#renderForm should return a form if state.passwordReset is false', function() {
    this.page.setState({ passwordReset: false });
    TestUtils.findRenderedDOMComponentWithTag.bind(null, this.page, 'form').should.not.throw();
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});
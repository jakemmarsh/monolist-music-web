'use strict';

import ReactDOM           from 'react-dom';
import TestUtils          from 'react-addons-test-utils';
import when               from 'when';

import TestHelpers        from '../../utils/testHelpers';
import ForgotPasswordPage from '../../app/js/pages/ForgotPasswordPage';
import AuthAPI            from '../../app/js/utils/AuthAPI';

describe('Page: ForgotPassword', function() {

  this.timeout(5000);

  beforeEach(function(done) {
    this.container = document.createElement('div');
    TestHelpers.testPage('/forgot', {}, {}, {}, ForgotPasswordPage, this.container, (component) => {
      this.page = component;
      done();
    });
  });

  it('#isFormInvalid should return true if no username has been entered', function() {
    this.page.isFormInvalid().should.be.true();
  });

  it('#isFormInvalid should return false if username has been entered', function() {
    const usernameInput = this.page.refs.usernameInput;

    TestUtils.Simulate.change(usernameInput, { target: { value: 'test' } });

    this.page.isFormInvalid().should.be.false();
  });

  it('#handleSubmit should make request and update state', function(done) {
    const username = 'test';
    const spy = sandbox.spy(this.page, 'setState');

    sandbox.mock(AuthAPI).expects('forgotPassword').withArgs(username).returns(when());
    this.page.setState({ username: username });

    this.page.handleSubmit(TestHelpers.createNativeClickEvent());

    // ensure promise has been resolved and state has been updated
    setTimeout(function() {
      sinon.assert.calledWith(spy, {
        emailSent: true,
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

  it('#renderForm should return a paragraph message if state.emailSent is true', function() {
    this.page.setState({ emailSent: true });
    TestUtils.findRenderedDOMComponentWithClass.bind(null, this.page, 'email-sent-message').should.not.throw();
  });

  it('#renderForm should return a form if state.emailSent is false', function() {
    this.page.setState({ emailSent: false });
    TestUtils.findRenderedDOMComponentWithTag.bind(null, this.page, 'form').should.not.throw();
  });

  it('#renderBackLink should not return an element if state.emailSent is true', function() {
    this.page.setState({ emailSent: true });
    Should(this.page.renderBackLink()).be.undefined();
  });

  it('#renderBackLink should return an element if state.emailSent is false', function() {
    this.page.setState({ emailSent: false });
    Should(this.page.renderBackLink()).not.be.undefined();
  });

  afterEach(function() {
    if ( this.container ) { ReactDOM.unmountComponentAtNode(this.container); }
  });

});

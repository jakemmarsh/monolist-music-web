'use strict';

import request from 'superagent';

function httpStub() {
  return {
    withCredentials: () => {
      return { end: () => {} };
    }
  };
};

beforeEach(function() {
  global.sandbox = sinon.sandbox.create();
  global.sandbox.stub(request, 'get', httpStub);
  global.sandbox.stub(request, 'put', httpStub);
  global.sandbox.stub(request, 'patch', httpStub);
  global.sandbox.stub(request, 'post', httpStub);
  global.sandbox.stub(request, 'del', httpStub);
});

afterEach(function() {
  global.sandbox.restore();
});
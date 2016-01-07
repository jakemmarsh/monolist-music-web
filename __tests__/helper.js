'use strict';

function httpStub() {
  return {
    withCredentials: () => {
      return { end: () => {} };
    }
  };
}

global.requestStub = {
  get: httpStub,
  put: httpStub,
  patch: httpStub,
  post: httpStub,
  del: httpStub,
  '@global': true
};

beforeEach(function() {
  global.sandbox = sinon.sandbox.create();
});

afterEach(function() {
  global.sandbox.restore();
});
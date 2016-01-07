'use strict';

function httpStub() {
  return {
    withCredentials: () => {
      return { end: () => {} };
    }
  };
}

global.requestStub = {
  'request': {
    'get': httpStub,
    'put': httpStub,
    'patch': httpStub,
    'post': httpStub,
    'del': httpStub,
    '@global': true
  }
};

beforeEach(function() {
  global.sandbox = sinon.sandbox.create();
});

afterEach(function() {
  global.sandbox.restore();
});
'use strict';

import request from 'superagent';

function httpStub() {
  return {
    withCredentials: () => {
      return { end: () => {} };
    }
  };
};

beforeEach(function(done) {
  global.sandbox = sinon.sandbox.create();

  global.getStub = global.sandbox.stub(request, 'get', httpStub);
  global.putStub = global.sandbox.stub(request, 'put', httpStub);
  global.patchStub = global.sandbox.stub(request, 'patch', httpStub);
  global.postStub = global.sandbox.stub(request, 'post', httpStub);
  global.delStub = global.sandbox.stub(request, 'del', httpStub);

  done();
});

afterEach(function(done) {
  global.sandbox.restore();

  done();
});
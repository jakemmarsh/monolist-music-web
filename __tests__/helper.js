'use strict';

import request from 'superagent';

beforeEach(function() {
  global.sandbox = sinon.sandbox.create();
  global.sandbox.stub(request, 'get');
  global.sandbox.stub(request, 'put');
  global.sandbox.stub(request, 'patch');
  global.sandbox.stub(request, 'post');
  global.sandbox.stub(request, 'del');
});

afterEach(function() {
  global.sandbox.restore();
});
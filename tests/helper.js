'use strict';

import request from 'superagent';

beforeEach(function() {
  global.sandbox = sinon.sandbox.create();

  const superagentStub = {
    withCredentials() {
      return {
        on() {
          return {
            attach() {
              return {
                end: sandbox.stub()
              };
            },
            end: sandbox.stub()
          };
        }
      };
    }
  };

  sandbox.stub(request, 'get').returns(superagentStub);
  sandbox.stub(request, 'post').returns(superagentStub);
  sandbox.stub(request, 'patch').returns(superagentStub);
  sandbox.stub(request, 'put').returns(superagentStub);
  sandbox.stub(request, 'del').returns(superagentStub);
});

afterEach(function() {
  global.sandbox.restore();
});

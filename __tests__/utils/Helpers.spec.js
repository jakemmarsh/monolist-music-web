'use strict';

import Helpers from '../../app/js/utils/Helpers';

describe('Util: Helpers', function() {

  it('should build a page title', function(done) {
    Helpers.buildPageTitle('test').should.equal('test \u2014 Monolist');
    Helpers.buildPageTitle().should.equal('Monolist');
    done();
  });

  it('should recursively call a function on the keys of an object', function(done) {
    const obj = {
        camel_case: 'yes', // eslint-disable-line camelcase
        WhatIsThisCase: 'yes'
    };
    const spy = sandbox.spy();

    Helpers.processObjectKeys(obj, spy);

    sinon.assert.callCount(spy, 2);

    done();
  });

});

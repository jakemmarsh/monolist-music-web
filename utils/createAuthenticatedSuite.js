'use strict';

import request from 'supertest';
const agent    = request.agent(url);
const url      = 'http://localhost:3000/v1/';

module.exports = function(name, tests) {

  describe(name, function() {

    this.timeout(5000);

    beforeEach(function(done) {
      // var user = {
      //   username: 'test',
      //   password: 'test'
      // };

      // agent.post('auth/login')
      // .send(user)
      // .end(function(err, res) {
      //   if ( !global.agent ) { global.agent = agent; }
      //   // global.cookies = res.headers['set-cookie'].pop().split(';')[0];
      //   global.agent.saveCookies(res);
      //   done();
      // });
      done();
    });

    tests.call(this);

  });

};
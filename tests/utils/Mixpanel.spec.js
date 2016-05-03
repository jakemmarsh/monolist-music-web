'use strict';

import _        from 'lodash';

import Mixpanel from '../../app/js/utils/Mixpanel';

describe('Util: Mixpanel', function() {

  it('#censorData should remove any censored fields', function() {
    const myData = {
      foo: 'bar',
      baz: 'bat',
      password: 'myPassword',
      hash: '2395sdf24ksD',
      user: {
        username: 'myUsername',
        password: 'test'
      }
    };
    const censoredData = Mixpanel.censorData(myData);

    censoredData.should.eql({
      foo: 'bar',
      baz: 'bat',
      password: '<< CENSORED >>',
      hash: '<< CENSORED >>',
      user: {
        username: 'myUsername',
        password: '<< CENSORED >>'
      }
    });
  });

  it('#doCall should not make a call if window.mixpanel is null or window.nodeEnv !== "production"', function() {
    const stub = sandbox.stub();
    window.mixpanel = null;
    window.nodeEnv = 'development';

    Mixpanel.doCall(stub);

    sinon.assert.notCalled(stub);
  });

  it('#doCall should call cb if window.mixpanel is defined and window.nodeEnv === "production"', function() {
    const stub = sandbox.stub();
    window.mixpanel = {};
    window.nodeEnv = 'production';

    Mixpanel.doCall(stub);

    sinon.assert.calledOnce(stub);
  });

  it('#loginUser should call this.doCall with a callback invoking mixpanel.identify and mixpanel.people.set', function(done) {
    const user = {
      id: 1,
      firstName: 'first',
      lastName: 'last',
      createdAt: 'test',
      email: 'test@test.com'
    };

    window.mixpanel = {
      identify: sandbox.stub(),
      people: {
        set: sandbox.stub()
      }
    };
    window.nodeEnv = 'production';

    sandbox.stub(Mixpanel, 'doCall', function(cb) {
      cb();

      sinon.assert.calledWith(window.mixpanel.identify, user.id);
      sinon.assert.calledWith(window.mixpanel.people.set, _.merge(user, {
        '$first_name': user.firstName,
        '$last_name': user.lastName,
        '$created': user.createdAt,
        '$email': user.email
      }));

      done();
    });

    Mixpanel.loginUser(user);
  });

  it('#logEvent should call this.doCall with a callback invoking mixpanel.track', function(done) {
    const eventName = 'test event';
    const data = { id: 1 };

    window.mixpanel = {
      track: sandbox.stub()
    };
    window.nodeEnv = 'production';

    sandbox.stub(Mixpanel, 'doCall', function(cb) {
      cb();

      sinon.assert.calledWith(window.mixpanel.track, eventName.toLowerCase(), data);

      done();
    });

    Mixpanel.logEvent(eventName, data);
  });

});

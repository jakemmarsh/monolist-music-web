'use strict';

import APIUtils from '../../app/js/utils/APIUtils';
import GroupAPI from '../../app/js/utils/GroupAPI';

describe('Util: GroupAPI', function() {

  beforeEach(function() {
    this.apiUtilsMock = sandbox.mock(APIUtils);
  });

  afterEach(function() {
    this.apiUtilsMock.restore();
  });

});
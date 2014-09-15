'use strict';

var https       = require('https');
var qs          = require('querystring');
var hostApi     = 'api.soundcloud.com';

module.exports = (function() {

  /*
   * Initialize with client id and client secret.
   *
   * @constructor
   */
  function SoundCloud() {
    // Not yet initialized by default
    this.isInit = false;
  }

  /* ====================================================== */

  /*
   * Initialize SoundCloud object with the necessary information:
   * - client ID
   * - client secret
   *
   * @param {Object} options
   */
  SoundCloud.prototype.init = function(options) {
    this.clientId = options.id;
    this.clientSecret = options.secret;

    this.isInit = true;
  };

  /* ====================================================== */

  /*
   * Make a call to the SoundCloud API
   *
   * @param {String} path
   * @param {Function} callback(error, data)
   * @return {Request}
   */

  SoundCloud.prototype.get = function(path, callback) {
    this.makeCall('GET', path, callback);
  };

  SoundCloud.prototype.post = function(path, callback) {
    this.makeCall('POST', path, callback);
  };

  SoundCloud.prototype.put = function(path, callback) {
    this.makeCall('PUT', path, callback);
  };

  SoundCloud.prototype.delete = function(path, callback) {
    this.makeCall('DELETE', path, callback);
  };

  SoundCloud.prototype.getMe = function(callback) {
    return this.get('me.json', callback);
  };

  /* ====================================================== */

  SoundCloud.prototype.makeCall = function(method, path, callback) {
    var params = {};

    if ( path && path.indexOf('/') === 0 ) {
      callback = callback || function () {};
      params.client_id = this.clientId;
      params.format = 'json';

      return request({
        method: method,
        uri: hostApi,
        path: path,
        qs: params
      }, callback);
    } else {
      callback({
        message: 'Invalid path: ' + path
      });

      return false;
    }
  };

  /* ====================================================== */

  function request(data, callback) {
    var qsdata = (data.qs) ? qs.stringify(data.qs) : '';
    var paramChar = data.path.indexOf('?') >= 0 ? '&' : '?';
    var options = {
      hostname: data.uri,
      path: data.path + paramChar + qsdata,
      method: data.method
    };

    if (data.method === 'POST') {
      options.path = data.path;
      options.headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Content-Length': qsdata.length
      };
    }

    var req = https.request(options, function (response) {
      var body = '';
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', function () {
        try {
          var d = JSON.parse(body);
          // See http://developers.soundcloud.com/docs/api/guide#errors for full list of error codes
          if ( Number(response.statusCode) >= 400 ) {
            callback(d.errors, d);
          } else {
            callback(undefined, d);
          }
        } catch (e) {
          callback(e);
        }
      });
    });

    req.on('error', function (e) {
      callback(e);
    });

    if (data.method === 'POST') {
      req.write(qsdata);
    }

    return req.end();
  }

  /* ====================================================== */

  return new SoundCloud();

})();
'use strict';

var when   = require('when');
var fs     = require('fs');
var AWS    = require('aws-sdk');
var config = require('../../config');

AWS.config.update({
  accessKeyId: config.aws.key,
  secretAccessKey: config.aws.secret
});

function getExtension(filename) {
  var i = filename.lastIndexOf('.');
  return (i < 0) ? '' : filename.substr(i);
}

exports.uploadImage = function(image, type, entityId) {
  var deferred = when.defer();
  var bucket = new AWS.S3({params: {Bucket: config.aws.bucket}});
  var folder = type === 'playlist' ? 'playlist_imgs/' : 'user_imgs/';
  var dataToPost = {
      Bucket: config.aws.bucket,
      Key: folder + entityId + getExtension(image.name),
      ACL: 'public-read',
      ContentType: image.type
  };

  fs.readFile(image.path, function(err, file) {
    dataToPost.Body = file;

    bucket.putObject(dataToPost, function(err, data) {
      if ( err ) {
        deferred.reject(err.message);
      } else {
        deferred.resolve(data);
      }
    });
  });

  return deferred.promise;
};
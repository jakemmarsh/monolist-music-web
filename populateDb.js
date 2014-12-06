'use strict';

var when = require('when');

/* ====================================================== */

module.exports = function(models) {

  console.log('inside populateDb');

  var createUser = function() {
    var deferred = when.defer();
    var user = {
      username: 'jakemmarsh',
      email: 'jakemmarsh@gmail.com',
      imageUrl: 'https://monolist.s3.amazonaws.com/user_imgs/2014/12/c4e4a0e8c60dc51f40e8-1.png',
      hash: 'kenneth'
    };

    console.log('about to create:', user);

    models.User.create(user).then(function(createdUser) {
      console.log('created');
      deferred.resolve(createdUser);
    }).catch(function(err) {
      console.log('error creating instructor user:', err);
    });

    return deferred.promise;
  };

  createUser();

};
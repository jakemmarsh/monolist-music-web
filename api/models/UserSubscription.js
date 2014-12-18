'use strict';

module.exports = function(sequelize) {

  var UserSubscription = sequelize.define('UserSubscription', {},
  {
    methods: {
      associate: function(models) {
        UserSubscription.belongsTo(models.User, { as: 'Subscriber' });
        UserSubscription.belongsTo(models.User, { as: 'Target' });
      }
    }
  });

  return UserSubscription;

};
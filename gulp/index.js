'use strict';

var fs          = require('fs');
var onlyScripts = require('./util/script-filter');
var dotenv      = require('dotenv');
var tasks       = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);

dotenv.load();

tasks.forEach(function(task) {
  require('./tasks/' + task);
});
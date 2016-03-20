'use strict';

import fs          from 'fs';
import onlyScripts from './util/script-filter';
import dotenv      from 'dotenv';
const tasks        = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);

dotenv.load();

tasks.forEach(function(task) {
  require('./tasks/' + task);
});

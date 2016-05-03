'use strict';

import config  from '../config';
import http    from 'http';
import express from 'express';
import gulp    from 'gulp';
import gutil   from 'gulp-util';
import morgan  from 'morgan';

gulp.task('server', () => {

  const server = express();

  // log all requests to the console
  server.use(morgan('dev'));

  server.use('*/js', express.static('./build/js'));
  server.use('*/images', express.static('./build/images'));
  server.use('*/css', express.static('./build/css'));
  server.use('*/fonts', express.static('./build/fonts'));
  server.use('*/node_modules', express.static('./node_modules'));

  // Serve index.html for all routes to leave routing up to Angular
  server.all('/*', (req, res) => {
      res.sendFile('index.html', { root: 'build' });
  });

  // Start webserver if not already running
  const s = http.createServer(server);

  s.on('error', (err) => {
    if(err.code === 'EADDRINUSE'){
      gutil.log('Development server is already started at port ' + config.serverPort);
    }
    else {
      throw err;
    }
  });

  s.listen(config.serverPort);

});

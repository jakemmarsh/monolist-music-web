monolist-web [![Codeship Status for jakemmarsh/monolist-web](https://codeship.com/projects/a048c5a0-503c-0133-9398-3ae26323838a/status?branch=master)](https://codeship.com/projects/107606) [![Dependency Status](https://david-dm.org/jakemmarsh/monolist-web.svg)](https://david-dm.org/jakemmarsh/monolist-web) [![devDependency Status](https://david-dm.org/jakemmarsh/monolist-web/dev-status.svg)](https://david-dm.org/jakemmarsh/monolist-web#info=devDependencies)
============================================================================================================================================================================================

ReactJS/RefluxJS application for Monolist. Served using node.js and Express.

---

#### To get up and running:

1. Clone this repo
2. Install node.js and NPM globally if you have not before. [Instructions here](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
3. Run `npm install` from root project directory
4. Run `gulp dev`

Now that `gulp dev` is running, the server is up and serving files from the `/build` directory. In addition, any changes made to the `/app` directory will be automatically processed by Gulp and the changes will be injected via [Browsersync](http://www.browsersync.io/) to any open browsers pointed at the proxy address.

The application is served at `localhost:3002` by default (to be run alongside the [api](https://github.com/jakemmarsh/monolist-api)).

**Note:** Any API calls will be made to `localhost:3000/v1/` by default, unless changed in [APIUtils.js](https://github.com/jakemmarsh/monolist-web/blob/master/app/js/utils/APIUtils.js).

---

#### To run tests and generate coverage files:

1. Clone repo, install dependencies (Steps 1-3 above)
2. Run `gulp test` to run all tests. Coverage files are output to `__coverage__/` directory.
3. Individual tests can be run with `gulp test -f <path_to_file>`.

---

#### Sample .env configuration file

Below is a `.env` file (with any actual keys/credentials removed). This same structure can be used to add any extra configuration information you may need, available at `process.env.*` while running on the server-side.

```
NODE_ENV='<production, development, etc>'

FB_DEV_ID='<app ID of development Facebook app>'
FB_PROD_ID='<app ID of actual Facebook app>'

AWS_KEY='<AWS access key>'
AWS_SECRET='<AWS secret key>'
S3_BUCKET='<AWS bucket name>'
```

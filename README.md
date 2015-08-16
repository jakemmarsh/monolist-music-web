monolist-web
============

ReactJS/RefluxJS application for Monolist. Served using node.js and Express.

---

#### To get up and running:

1. Clone this repo
2. Install node.js and NPM globally if you have not before. [Instructions here](http://blog.nodeknockout.com/post/65463770933/how-to-install-node-js-and-npm)
3. Run `npm install` from root project directory
4. Run `gulp dev` to start server, compile application, and watch for any changes

The API is served at `localhost:3005` by default (to be run alongside the [api](https://github.com/jakemmarsh/monolist-api)).

**Note:** Any API calls will be made to `localhost:3000/v1/` by default, unless changed in [APIUtils.js](https://github.com/jakemmarsh/monolist-web/blob/master/app/js/utils/APIUtils.js).

---

#### To run tests and generate coverage files:

1. Clone repo, install dependencies (Steps 1-3 above)
2. Run `gulp test` to run all tests. Coverage files are output to `__coverage__/` directory.
3. Individual tests can be run with `gulp test -f <path_to_file>`.

---

#### To deploy

1. Clone repo, install dependencies (Steps 1-3 above)
2. Run `gulp deploy` to deploy to staging/dev, or `gulp deploy -prod`  to deploy to production.

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

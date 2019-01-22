// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

// hack to let the server forward a cookie in CookieServerInterceptor
import * as XHR2 from 'xhr2';
XHR2.prototype._restrictedHeaders.cookie = false;

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import * as compression from 'compression';
import { lookup } from 'mime-types';
import { join, extname } from 'path';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 3080;
const DIST_FOLDER = join(process.cwd(), 'dist');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

app.use('*', (req, res, next) => {
  res.header('X-powered-by', 'Blood, sweat, and tears');
  next();
});

app.use('*.*', function (req, res, next) {
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', lookup(extname(req.originalUrl)));
  req.url = req.url + '.gz';
  next();
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// Use compression only for Universal routes, not static files
app.use(compression());

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', {
    req: req,
    res: res,
    providers: [
      {
        provide: 'REQUEST', useValue: (req)
      },
      {
        provide: 'RESPONSE', useValue: (res)
      }
    ]
  }, (err, html) => {
    if (err) {
      // Here we catch the errors and we send back a generic error message.
      console.error(err);
      res.send('An error occured.');
    }
    res.send(html);
  });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});

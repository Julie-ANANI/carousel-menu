import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';
//  import { AppServerModuleNgFactory } from '../dist/ngfactory/src/server.module.ngfactory'; // Do not delete. Generated file.
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';



enableProdMode();

const PORT = 3080;

const app = express();

const template = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html')).toString();

app.engine('html', (_, options, callback) => {
  const opts = {document: template, url: options.req.url};

  // renderModuleFactory(AppServerModuleNgFactory, opts).then(html => callback(null, html));
});

app.set('view engine', 'html');
app.set('views', 'src');

app.get('*.*', express.static(path.join(__dirname, '..', 'dist')));

app.get('*', (req, res) => {
  res.render('index', {req: req});
});

app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});

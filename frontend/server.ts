import 'zone.js/node';
import { enableProdMode } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import express from 'express';
import { join } from 'path';
import { renderApplication } from '@angular/platform-server';
import  AppServerModule  from './src/main.server';

enableProdMode();

const app = express();
const PORT = process.env['PORT'] || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/frontend/browser');

// Servir archivos estáticos
app.use(express.static(DIST_FOLDER));

// Renderizar la aplicación Angular
app.get('*', (req, res, next) => {
  renderApplication(AppServerModule, {
    document: join(DIST_FOLDER, 'index.html'),
    url: req.originalUrl,
    platformProviders: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
  })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Node server is running on http://localhost:${PORT}`);
});

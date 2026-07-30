import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appconfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appconfig)
  .catch((err) => console.error(err));

import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter,withInMemoryScrolling} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideNgxStripe } from 'ngx-stripe';
import { provideQuillConfig } from 'ngx-quill/config';

import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
    withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })),
    provideHttpClient(),
    provideNgxStripe(environment.stripePublicKey),
    provideQuillConfig({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'header': [1, 2, 3, false] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['clean']
        ]
      },
      placeholder: 'Voeg een beschrijving toe...',
      theme: 'snow'
    })
  ],
};

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

/** Configuration globale de l'application */
export const appConfig: ApplicationConfig = {
  providers: [
    // Présent par défaut
    provideZoneChangeDetection({ eventCoalescing: true }), provideClientHydration(),
    // Pour charger les routes
    provideRouter(routes, withHashLocation()),
    // Pour faire fonctionner Matérial
    provideAnimations(), provideAnimationsAsync(), provideNativeDateAdapter(),
    // Configuration de Material
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ]
};

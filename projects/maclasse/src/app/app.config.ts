import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

// Enregristement des libellés de la LOCALE française
registerLocaleData(localeFr, 'fr');

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
    // Configuration i18n
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: LOCALE_ID, useValue: 'fr' }
  ]
};

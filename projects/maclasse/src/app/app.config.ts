import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

/** Configuration globale de l'application */
export const appConfig: ApplicationConfig = {
  providers: [
    // Présent par défaut
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
    // Pour charger les routes
    provideRouter(routes, withHashLocation()),
    // Pour faire fonctionner Matérial
    provideAnimations(), provideAnimationsAsync()
  ]
};

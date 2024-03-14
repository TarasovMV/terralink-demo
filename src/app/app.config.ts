import {provideAnimations} from '@angular/platform-browser/animations';
import {TuiRootModule} from '@taiga-ui/core';
import {ApplicationConfig, importProvidersFrom, isDevMode} from '@angular/core';
import {PreloadAllModules, provideRouter, withPreloading} from '@angular/router';
import {appRoutes} from './app.routes';
import {provideAngularSvgIcon} from 'angular-svg-icon';
import {HttpClientModule} from '@angular/common/http';
import {provideServiceWorker} from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideAngularSvgIcon(),
        importProvidersFrom(TuiRootModule),
        importProvidersFrom(HttpClientModule),
        provideRouter(appRoutes, withPreloading(PreloadAllModules)),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
};

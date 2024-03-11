import {provideAnimations} from '@angular/platform-browser/animations';
import {TuiRootModule} from '@taiga-ui/core';
import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {PreloadAllModules, provideRouter, withPreloading} from '@angular/router';
import {appRoutes} from './app.routes';
import {provideAngularSvgIcon} from 'angular-svg-icon';
import {HttpClientModule} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(HttpClientModule),
        provideAnimations(),
        provideRouter(appRoutes, withPreloading(PreloadAllModules)),
        importProvidersFrom(TuiRootModule),
        provideAngularSvgIcon(),
    ],
};

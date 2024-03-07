import {Route} from '@angular/router';
import {Pages} from '@terralink-demo/models';
import {authGuard} from './guards';

const DEFAULT_PAGE = Pages.Game;

export const appRoutes: Route[] = [
    {
        path: Pages.Welcome,
        loadComponent: () =>
            import('../app/pages/welcome-page/welcome-page.component').then(c => c.WelcomePageComponent),
    },
    {
        path: Pages.Register,
        loadComponent: () =>
            import('../app/pages/register-page/register-page.component').then(c => c.RegisterPageComponent),
    },
    {
        path: Pages.Auth,
        loadComponent: () => import('../app/pages/auth-page/auth-page.component').then(c => c.AuthPageComponent),
    },
    {
        path: Pages.Game,
        loadComponent: () => import('../app/pages/game-page/game-page.component').then(c => c.GamePageComponent),
        canActivate: [authGuard],
    },
    {
        path: Pages.Map,
        loadComponent: () => import('../app/pages/map-page/map-page.component').then(c => c.MapPageComponent),
        canActivate: [authGuard],
    },
    {
        path: Pages.Presentation,
        loadComponent: () =>
            import('../app/pages/presentation-page/presentation-page.component').then(c => c.PresentationPageComponent),
        canActivate: [authGuard],
    },
    {
        path: Pages.Rules,
        loadComponent: () => import('../app/pages/rules-page/rules-page.component').then(c => c.RulesPageComponent),
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: DEFAULT_PAGE,
    },
];

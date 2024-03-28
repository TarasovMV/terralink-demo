import {Route} from '@angular/router';
import {Pages} from '@terralink-demo/models';
import {alreadyAuthGuard, authGuard} from './guards';

const DEFAULT_PAGE = Pages.Game;

export const appRoutes: Route[] = [
    {
        path: Pages.Organizator,
        loadComponent: () =>
            import('../app/pages/organizator-page/organizator-page.component').then(c => c.OrganizatorPageComponent),
    },
    {
        path: Pages.OrganizatorMark,
        loadComponent: () =>
            import('../app/pages/organizator-mark-page/organizator-mark-page.component').then(
                c => c.OrganizatorMarkPageComponent,
            ),
    },
    {
        path: Pages.Welcome,
        loadComponent: () =>
            import('../app/pages/welcome-page/welcome-page.component').then(c => c.WelcomePageComponent),
        canActivate: [alreadyAuthGuard],
    },
    {
        path: Pages.Register,
        loadComponent: () =>
            import('../app/pages/register-page/register-page.component').then(c => c.RegisterPageComponent),
        canActivate: [alreadyAuthGuard],
    },
    {
        path: `${Pages.Presentation}/:id`,
        data: {
            pageType: Pages.Presentation,
        },
        loadComponent: () =>
            import('../app/pages/presentation-page/presentation-page.component').then(c => c.PresentationPageComponent),
    },
    {
        path: `${Pages.ProductPresentation}/:id`,
        data: {
            pageType: Pages.ProductPresentation,
        },
        loadComponent: () =>
            import('../app/pages/presentation-page/presentation-page.component').then(c => c.PresentationPageComponent),
    },
    {
        path: Pages.Rules,
        loadComponent: () => import('../app/pages/rules-page/rules-page.component').then(c => c.RulesPageComponent),
        canActivate: [authGuard],
    },
    {
        path: Pages.RegisterSuccess,
        loadComponent: () =>
            import('../app/pages/user-register-success-page/user-register-success-page.component').then(
                c => c.UserRegisterSuccessPageComponent,
            ),
        // canActivate: [authGuard],
    },
    {
        path: Pages.OrgRegisterSuccess,
        loadComponent: () =>
            import('../app/pages/org-register-success-page/org-register-success-page.component').then(
                c => c.OrgRegisterSuccessPageComponent,
            ),
    },
    {
        path: Pages.Main,
        loadChildren: () => import('../app/pages/main-page/main-page.routes').then(r => r.MAIN_PAGE_ROUTES),
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: DEFAULT_PAGE,
    },
];

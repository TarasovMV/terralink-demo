import {Routes} from '@angular/router';
import {Pages} from '@terralink-demo/models';

export const MAIN_PAGE_ROUTES = [
    {
        path: '',
        loadComponent: () => import('./main-page.component').then(c => c.MainPageComponent),
        children: [
            {
                path: Pages.Game,
                loadComponent: () => import('../game-page/game-page.component').then(c => c.GamePageComponent),
            },
            {
                path: Pages.Map,
                loadComponent: () => import('../map-page/map-page.component').then(c => c.MapPageComponent),
            },
            {
                path: Pages.Knowledge,
                loadComponent: () =>
                    import('../knowledge-page/knowledge-page.component').then(c => c.KnowledgePageComponent),
            },
            {
                path: Pages.Profile,
                loadComponent: () => import('../profile-page/profile-page.component').then(c => c.ProfilePageComponent),
            },
            {
                path: '**',
                redirectTo: Pages.Game,
            },
        ],
    },
] satisfies Routes;

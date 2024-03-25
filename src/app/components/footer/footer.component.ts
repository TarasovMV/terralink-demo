import {ChangeDetectionStrategy, Component, computed, effect, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs';
import {SvgIconComponent} from 'angular-svg-icon';
import {TuiRippleModule} from '@taiga-ui/addon-mobile';
import {Pages} from '@terralink-demo/models';

enum FooterItem {
    Game = 'GAME',
    Map = 'MAP',
    Knowledge = 'KNOWLEDGE',
    Profile = 'PROFILE',
}

const FOOTER_ITEMS = [
    {
        iconPath: 'assets/footer/game.svg',
        label: 'Фрагменты',
        value: FooterItem.Game,
        redirectToUrl: Pages.Game,
    },
    {
        iconPath: 'assets/footer/map.svg',
        label: 'Карта',
        value: FooterItem.Map,
        redirectToUrl: Pages.Map,
    },
    {
        iconPath: 'assets/footer/knowledge.svg',
        label: 'База знаний',
        value: FooterItem.Knowledge,
        redirectToUrl: Pages.Knowledge,
    },
    {
        iconPath: 'assets/footer/profile.svg',
        label: 'Профиль',
        value: FooterItem.Profile,
        redirectToUrl: Pages.Profile,
    },
];

const getItemByRoute = (url: string): FooterItem => {
    const lastPath = url.split('/').pop();

    return FOOTER_ITEMS.find(item => lastPath?.includes(item.redirectToUrl))?.value ?? FooterItem.Game;
};

const checkOpenByRoute = (url: string): boolean => {
    return true;
};

@Component({
    selector: 'footer',
    standalone: true,
    imports: [CommonModule, SvgIconComponent, TuiRippleModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
    private readonly router = inject(Router);
    private readonly routerChanges$ = inject(Router).events.pipe(
        filter(e => e instanceof NavigationEnd),
        map(e => e as NavigationEnd),
    );

    readonly currentItem = toSignal(this.routerChanges$.pipe(map(e => getItemByRoute(e.url))), {
        initialValue: getItemByRoute(this.router.url),
    });

    readonly isOpen = toSignal(this.routerChanges$.pipe(map(e => checkOpenByRoute(e.url))), {
        initialValue: checkOpenByRoute(this.router.url),
    });

    readonly items = computed(() => {
        return [...FOOTER_ITEMS].map(item => ({...item, active: item.value === this.currentItem()}));
    });

    clickItem(redirectToUrl: Pages) {
        this.router.navigate([redirectToUrl]);
    }
}

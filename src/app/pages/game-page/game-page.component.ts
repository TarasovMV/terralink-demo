import {AfterViewInit, ChangeDetectionStrategy, Component, inject, NO_ERRORS_SCHEMA, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiCarouselModule} from '@taiga-ui/kit';
import {GameCardComponent} from './components/game-card/game-card.component';
import {GamePagerComponent} from './components/game-pager/game-pager.component';
import {ButtonComponent} from '@terralink-demo/ui';
import {GamePlayComponent} from './components/game-play/game-play.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';
import {CardMeta, CARDS} from './domain';

@Component({
    selector: 'game-page',
    standalone: true,
    imports: [
        CommonModule,
        TuiCarouselModule,
        GameCardComponent,
        GamePagerComponent,
        ButtonComponent,
        GamePlayComponent,
    ],
    schemas: [NO_ERRORS_SCHEMA],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent implements AfterViewInit {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly index = +(this.route.snapshot.queryParamMap.get('id') || 0);

    readonly cardIndex = signal<number>(this.index);
    readonly cards = signal<CardMeta[]>([...CARDS]);

    private get swiperElement(): any {
        return document.querySelector('swiper-container');
    }

    ngAfterViewInit(): void {
        const swiperEl = this.swiperElement;
        swiperEl.swiper.slideTo(this.cardIndex());
        this.handleSwipe();
    }

    goToMap(): void {
        this.router.navigate([Pages.Map], {queryParams: {id: this.cardIndex()}});
    }

    private handleSwipe(): void {
        const swiperEl = this.swiperElement;

        if (!swiperEl) {
            return;
        }

        document.documentElement.style.setProperty(
            '--swiper-container-height',
            `${swiperEl.getBoundingClientRect().height - 15}px`,
        );

        swiperEl.addEventListener('swiperslidechange', (event: any) => {
            const [swiper] = (event as any).detail;
            this.cardIndex.set(swiper.activeIndex);
        });
    }
}

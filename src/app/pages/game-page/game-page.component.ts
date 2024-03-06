import {AfterViewInit, ChangeDetectionStrategy, Component, NO_ERRORS_SCHEMA, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiCarouselModule} from '@taiga-ui/kit';
import {GameCardComponent} from '@terralink-demo/pages/game-page/components/game-card/game-card.component';
import {GamePagerComponent} from '@terralink-demo/pages/game-page/components/game-pager/game-pager.component';
import {ButtonComponent} from '@terralink-demo/ui';
import {GamePlayComponent} from '@terralink-demo/pages/game-page/components/game-play/game-play.component';

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
    readonly cardIndex = signal<number>(0);

    ngAfterViewInit(): void {
        this.handleSwipe();
    }

    private handleSwipe(): void {
        const swiperEl = document.querySelector('swiper-container');

        if (!swiperEl) {
            return;
        }

        document.documentElement.style.setProperty(
            '--swiper-container-height',
            `${swiperEl.getBoundingClientRect().height - 15}px`,
        );

        swiperEl.addEventListener('swiperslidechange', event => {
            const [swiper] = (event as any).detail;
            this.cardIndex.set(swiper.activeIndex);
        });
    }
}

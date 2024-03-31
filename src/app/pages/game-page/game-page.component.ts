import {
    ChangeDetectionStrategy,
    Component,
    computed,
    inject,
    NO_ERRORS_SCHEMA,
    OnDestroy,
    OnInit,
    signal,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiCarouselModule} from '@taiga-ui/kit';
import {GameCardComponent} from './components/game-card/game-card.component';
import {GamePagerComponent} from './components/game-pager/game-pager.component';
import {ButtonComponent} from '@terralink-demo/ui';
import {GamePlayComponent} from './components/game-play/game-play.component';
import {ActivatedRoute, Router} from '@angular/router';
import {StandMeta, Pages} from '@terralink-demo/models';
import {LoaderService} from '../../services/loader.service';
import {GameService} from '../../services/game.service';
import {CARDS} from '../../domain/cards.const';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {ScannerComponent} from '../../dialogs/scanner/scanner.component';
import {TuiAlertService, TuiDialogService} from '@taiga-ui/core';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {SvgIconComponent} from 'angular-svg-icon';
import {finalize, takeUntil} from 'rxjs';
import {MapDialogComponent} from '../../dialogs/map-dialog/map-dialog.component';

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
        SvgIconComponent,
    ],
    providers: [TuiDestroyService],
    schemas: [NO_ERRORS_SCHEMA],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent implements OnInit, OnDestroy {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly dialog = inject(TuiDialogService);
    private readonly alertService = inject(TuiAlertService);
    private readonly destroy$ = inject(TuiDestroyService);
    private readonly gameService = inject(GameService);
    private readonly showLoader = inject(LoaderService).showLoader;

    readonly cardIndex = signal<number>(0);
    readonly cards = signal<StandMeta[]>([]);
    readonly progress = computed<number>(() => {
        return this.cards().reduce((acc, next) => acc + (next.done ? 1 : 0), 0);
    });

    private get swiperElement(): any {
        return document.querySelector('swiper-container');
    }

    private get currentStand(): StandMeta {
        return this.cards()[this.cardIndex()];
    }

    ngOnInit(): void {
        this.showLoader.set(true);

        this.gameService
            .getCards()
            .pipe(finalize(() => this.showLoader.set(false)))
            .subscribe({
                next: res => {
                    this.cards.set(res);
                    setTimeout(() => {
                        const id = +(this.route.snapshot.queryParamMap.get('id') || 0);
                        const idx = this.cards().findIndex(c => c.id === id);

                        if (idx >= 0) {
                            this.updateCardIndex(idx);
                        }
                        this.handleSwipe();
                    });
                },
                error: () => this.showError('Ошибка при загрузке стендов'),
            });
    }

    ngOnDestroy(): void {
        this.showLoader.set(false);
    }

    scanQr(): void {
        this.dialog
            .open<string>(new PolymorpheusComponent(ScannerComponent), {
                size: 'page',
                closeable: false,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => res && this.doneCard(res));
    }

    goToMap(): void {
        this.dialog
            .open<string>(new PolymorpheusComponent(MapDialogComponent), {
                size: 'page',
                closeable: false,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    goToPresentation(): void {
        this.router.navigate([Pages.StandPresentation, this.currentStand.id], {
            queryParams: {stand_id: this.currentStand.id},
        });
    }

    private doneCard(strCardId: string): void {
        const standPrefix = 'stand_';

        if (!strCardId.includes(standPrefix)) {
            this.showError();

            return;
        }

        const id = +strCardId.trim().replace(standPrefix, '');
        const cards = this.cards();

        if (cards.some(c => c.id === id && c.done)) {
            this.showError('Данный QR-код уже был использован');

            return;
        }

        this.showLoader.set(true);

        this.gameService
            .setDone(id)
            .pipe(
                finalize(() => this.showLoader.set(false)),
                takeUntil(this.destroy$),
            )
            .subscribe(() => {
                const card = cards.find(c => c.id === id);

                if (card) {
                    card.done = true;
                    this.updateCardIndex(this.cards().indexOf(card));
                } else {
                    this.showError();
                }

                this.cards.set([...cards]);

                setTimeout(() => this.gameService.forcePlayMusic.set(true));
            });
    }

    private showError(msg = 'Распознан неверный QR-код. Попробуйте еще раз'): void {
        this.alertService.open(msg, {status: 'error'}).subscribe();
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

    private updateCardIndex(index: number = this.cardIndex()): void {
        const swiperEl = this.swiperElement;

        this.cardIndex.set(index);
        swiperEl?.swiper?.slideTo(this.cardIndex());
    }
}

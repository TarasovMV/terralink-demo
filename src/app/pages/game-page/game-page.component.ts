import {
    AfterViewInit,
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
import {CardMeta, Pages} from '@terralink-demo/models';
import {SupabaseService} from '../../services/supabase.service';
import {LoaderService} from '../../services/loader.service';
import {GameService} from '../../services/game.service';
import {finalize, takeUntil} from 'rxjs';
import {CARDS} from '../../domain/cards.const';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {ScannerComponent} from '../../dialogs/scanner/scanner.component';
import {TuiAlertService, TuiDialogService} from '@taiga-ui/core';
import {TuiDestroyService} from '@taiga-ui/cdk';

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
    providers: [TuiDestroyService],
    schemas: [NO_ERRORS_SCHEMA],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly dialog = inject(TuiDialogService);
    private readonly alertService = inject(TuiAlertService);
    private readonly destroy$ = inject(TuiDestroyService);
    private readonly supabaseService = inject(SupabaseService);
    private readonly gameService = inject(GameService);
    private readonly showLoader = inject(LoaderService).showLoader;

    readonly cardIndex = signal<number>(+(this.route.snapshot.queryParamMap.get('id') || 0));
    readonly cards = signal<CardMeta[]>([...CARDS]);
    readonly progress = computed<number>(() => this.cards().reduce((acc, next) => acc + (next.done ? 1 : 0), 0));

    private get swiperElement(): any {
        return document.querySelector('swiper-container');
    }

    ngOnInit(): void {
        this.showLoader.set(true);

        this.gameService
            .getCards()
            .pipe(finalize(() => this.showLoader.set(false)))
            .subscribe(res => this.cards.set(res));
    }

    ngOnDestroy(): void {
        this.showLoader.set(false);
    }

    ngAfterViewInit(): void {
        this.updateCardIndex();
        this.handleSwipe();
    }

    scanQr(): void {
        this.dialog
            .open<string>(new PolymorpheusComponent(ScannerComponent), {
                size: 'page',
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => res && this.doneCard(res));
    }

    goToMap(): void {
        this.router.navigate([Pages.Map], {queryParams: {id: this.cardIndex()}});
    }

    tempQuit(): void {
        this.supabaseService.signOut().subscribe(() => this.router.navigate([Pages.Welcome]));
    }

    private doneCard(strCardId: string): void {
        const standPrefix = 'stand_';

        if (!strCardId.includes(standPrefix)) {
            this.showCardError();

            return;
        }

        const id = +strCardId.trim().replace(standPrefix, '');

        this.showLoader.set(true);
        this.gameService
            .setDone(id)
            .pipe(
                finalize(() => this.showLoader.set(false)),
                takeUntil(this.destroy$),
            )
            .subscribe(() => {
                this.cards.update(cards => {
                    const card = cards.find(c => c.id === id);

                    if (card) {
                        card.done = true;
                        this.updateCardIndex(id - 1);
                    } else {
                        this.showCardError();
                    }

                    return [...cards];
                });
            });
    }

    private showCardError(): void {
        this.alertService.open('Распознан неверный QR-код. Попробуйте еще раз', {status: 'error'}).subscribe();
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

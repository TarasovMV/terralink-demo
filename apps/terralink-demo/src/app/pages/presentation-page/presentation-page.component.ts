import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Pages, PresentationMeta, StandMeta} from '@terralink-demo/models';
import {ButtonComponent} from '@terralink-demo/ui';
import {TuiAlertService, TuiDialogService} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {catchError, finalize, forkJoin, map, Observable, of, switchMap, takeUntil, tap, throwError} from 'rxjs';
import {PresentationSendComponent} from '../../dialogs/presentation-send/presentation-send.component';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {SupabaseService} from '../../services/supabase.service';
import {LoaderService} from '../../services/loader.service';

interface Presentation {
    title: string;
    body: string;
    image_path: string;
    paragraphs: {
        title: string;
        body: string;
    }[];
}

@Component({
    selector: 'presentation-page',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    providers: [TuiDestroyService],
    templateUrl: './presentation-page.component.html',
    styleUrl: './presentation-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationPageComponent implements OnInit {
    private readonly showLoader = inject(LoaderService).showLoader;
    private readonly supabaseService = inject(SupabaseService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly alertService = inject(TuiAlertService);
    private readonly dialog = inject(TuiDialogService);
    private readonly destroy$ = inject(TuiDestroyService);

    private readonly id = +(this.route.snapshot.paramMap.get('id') || 1);
    private readonly isProduct = this.route.snapshot.data['pageType'] === Pages.ProductPresentation;

    readonly buttonType = signal<'primary' | 'disabled'>('primary');
    readonly meta = signal<Presentation | null>(null);

    ngOnInit(): void {
        this.showLoader.set(true);

        forkJoin([this.checkPresentation(), this.getMeta()])
            .pipe(
                finalize(() => this.showLoader.set(false)),
                takeUntil(this.destroy$),
            )
            .subscribe({
                error: () =>
                    this.alertService.open('Произошла ошибка при загрузке презентации', {status: 'error'}).subscribe(),
            });
    }

    back(): void {
        const standId = this.route.snapshot.queryParamMap.get('stand_id');
        const productId = this.route.snapshot.queryParamMap.get('product_id');

        if (this.route.snapshot.data['pageType'] === Pages.ProductPresentation) {
            this.router.navigate([Pages.Knowledge], {queryParams: {id: productId}});

            return;
        }

        this.router.navigate([Pages.Game], {queryParams: {id: standId}});
    }

    openSend(): void {
        if (this.buttonType() === 'disabled') {
            this.alertService.open('Вы уже запросили эту презентацию').subscribe();

            return;
        }

        this.showLoader.set(true);
        this.supabaseService
            .getCurrentUser()
            .pipe(
                map(user => user.email),
                catchError(() => of('')),
                finalize(() => this.showLoader.set(false)),
                takeUntil(this.destroy$),
            )
            .subscribe(email => {
                this.dialog
                    .open<boolean>(new PolymorpheusComponent(PresentationSendComponent), {
                        size: 'page',
                        dismissible: false,
                        closeable: false,
                        data: {
                            id: this.id,
                            email,
                            type: this.isProduct ? 'product' : 'stand',
                        },
                    })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(res => {
                        res && this.buttonType.set('disabled');
                    });
            });
    }

    private checkPresentation(): Observable<unknown> {
        return this.supabaseService.checkPresentation(this.id, this.isProduct ? 'product' : 'stand').pipe(
            catchError(() => of(false)),
            tap(res => this.buttonType.set(res ? 'disabled' : 'primary')),
        );
    }

    private getMeta(): Observable<unknown> {
        return (this.isProduct ? this.getByProduct() : this.getByStand()).pipe(
            tap(presentation => this.meta.set(presentation)),
        );
    }

    private getByStand(): Observable<Presentation> {
        let stand: StandMeta | undefined;

        return this.supabaseService.getStands().pipe(
            switchMap(stands => {
                stand = stands.find(s => s.id === this.id);

                if (!stand) {
                    return throwError(() => new Error('Stand not found'));
                }

                return this.supabaseService.getProductsByStand(stand.id);
            }),
            map(products => ({
                ...stand!,
                body: stand!.description,
                paragraphs: products,
            })),
        );
    }

    private getByProduct(): Observable<Presentation> {
        return this.supabaseService.getProduct(this.id).pipe(
            map(product => ({
                ...product,
                paragraphs: [],
            })),
        );
    }
}

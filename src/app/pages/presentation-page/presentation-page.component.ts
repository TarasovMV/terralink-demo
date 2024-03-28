import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Pages, PresentationMeta} from '@terralink-demo/models';
import {ButtonComponent} from '@terralink-demo/ui';
import {TuiAlertService, TuiDialogService} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {catchError, finalize, forkJoin, Observable, of, takeUntil, tap} from 'rxjs';
import {PresentationSendComponent} from '../../dialogs/presentation-send/presentation-send.component';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {SupabaseService} from '../../services/supabase.service';
import {LoaderService} from '../../services/loader.service';

interface Presentation {
    title: string;
    body: string;
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

    readonly buttonType = signal<'primary' | 'disabled'>('primary');
    readonly meta = signal<Presentation | null>(null);

    ngOnInit(): void {
        this.showLoader.set(true);

        forkJoin([
            this.checkPresentation(),
            this.getMeta()
        ]).pipe(
            finalize(() => this.showLoader.set(false)),
            takeUntil(this.destroy$),
        ).subscribe({
            error: () => this.alertService.open('Произошла ошибка при загрузке презентации', {status: 'error'}).subscribe()
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

        this.dialog
            .open<boolean>(new PolymorpheusComponent(PresentationSendComponent), {
                size: 'page',
                dismissible: false,
                closeable: false,
                data: this.id,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
                res && this.buttonType.set('disabled');
            });
    }

    private checkPresentation(): Observable<unknown> {
        return this.supabaseService
            .checkPresentation(this.id)
            .pipe(
                catchError(() => of(false)),
                tap((res) => this.buttonType.set(res ? 'disabled' : 'primary')),
            )
    }

    private getMeta(): Observable<unknown> {
        return this.supabaseService.getPresentation(this.id)
            .pipe(tap((res) => this.meta.set(this.metaMapper(res))));
    }


    // TODO: для парсинга пунктов
    private metaMapper(meta: PresentationMeta): Presentation {
        return {} as Presentation;
    }
}

import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';
import {ButtonComponent} from '@terralink-demo/ui';
import {TuiAlertService, TuiDialogService} from "@taiga-ui/core";
import {PolymorpheusComponent} from "@tinkoff/ng-polymorpheus";
import {catchError, finalize, of, takeUntil} from "rxjs";
import {PresentationSendComponent} from "../../dialogs/presentation-send/presentation-send.component";
import {TuiDestroyService} from "@taiga-ui/cdk";
import {SupabaseService} from "../../services/supabase.service";
import {LoaderService} from "../../services/loader.service";

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

    private readonly index = this.route.snapshot.queryParamMap.get('id') || 0;

    readonly buttonType = signal<'primary' | 'disabled'>('primary');

    ngOnInit(): void {
        this.showLoader.set(true);

        this.supabaseService.checkPresentation(+this.index + 1)
            .pipe(
                catchError(() => of(false)),
                finalize(() => this.showLoader.set(false)),
                takeUntil(this.destroy$)
            )
            .subscribe((res) => {
                this.buttonType.set(res ? 'disabled' : 'primary');
            })
    }

    back(): void {
        this.router.navigate([Pages.Game], {queryParams: {id: this.index}});
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
                data: +this.index
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                res && this.buttonType.set('disabled');
            });
    }
}

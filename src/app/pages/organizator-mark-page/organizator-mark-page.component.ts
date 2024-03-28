import {ChangeDetectionStrategy, Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '@terralink-demo/ui';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TuiAlertService, TuiDataListModule, TuiTextfieldControllerModule} from '@taiga-ui/core';
import {TuiDataListWrapperModule, TuiSelectModule, TuiTextareaModule} from '@taiga-ui/kit';
import {ActivatedRoute, Router} from '@angular/router';
import {StandMeta, Pages, UserMeta} from '@terralink-demo/models';
import {finalize, forkJoin, takeUntil} from 'rxjs';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {SupabaseService} from '../../services/supabase.service';
import {LoaderService} from '../../services/loader.service';

@Component({
    selector: 'organizator-mark-page',
    standalone: true,
    imports: [
        CommonModule,
        ButtonComponent,
        ReactiveFormsModule,
        TuiSelectModule,
        TuiDataListModule,
        TuiDataListWrapperModule,
        TuiTextfieldControllerModule,
        TuiTextareaModule,
    ],
    templateUrl: './organizator-mark-page.component.html',
    styleUrl: './organizator-mark-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizatorMarkPageComponent implements OnInit {
    private readonly supabaseService = inject(SupabaseService);
    private readonly alertService = inject(TuiAlertService);
    private readonly destroy$ = inject(TuiDestroyService);
    private readonly showLoader = inject(LoaderService).showLoader;
    private readonly router = inject(Router);

    private readonly userId = inject(ActivatedRoute).snapshot.queryParamMap.get('user');

    readonly formGroup = new FormGroup({
        comment: new FormControl<string>(''),
        stand: new FormControl<number | undefined>(undefined, [Validators.required]),
    });

    readonly stands: WritableSignal<StandMeta[]> = signal([]);
    readonly user: WritableSignal<UserMeta | null> = signal(null);

    ngOnInit(): void {
        if (!this.userId) {
            this.router.navigate([Pages.Organizator]);

            return;
        }

        this.showLoader.set(true);

        forkJoin([this.supabaseService.getUserById(+this.userId), this.supabaseService.getStands()])
            .pipe(
                finalize(() => this.showLoader.set(false)),
                takeUntil(this.destroy$),
            )
            .subscribe(([user, stands]) => {
                this.user.set(user);
                this.stands.set(stands);
            });
    }

    submit(): void {
        this.router.navigate([Pages.Organizator]);
    }

    cancel(): void {
        this.router.navigate([Pages.Organizator]);
    }
}

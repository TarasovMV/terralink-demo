import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QRCodeModule} from 'angularx-qrcode';
import {Pages, UserMeta} from '@terralink-demo/models';
import {SupabaseService} from '../../services/supabase.service';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {finalize, takeUntil} from 'rxjs';
import {LoaderService} from '../../services/loader.service';
import {TuiAlertService} from '@taiga-ui/core';
import {ButtonComponent} from '@terralink-demo/ui';
import {Router} from '@angular/router';

@Component({
    selector: 'profile-page',
    standalone: true,
    imports: [CommonModule, QRCodeModule, ButtonComponent],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
    private readonly supabaseService = inject(SupabaseService);
    private readonly router = inject(Router);
    private readonly alertService = inject(TuiAlertService);
    private readonly destroy$ = inject(TuiDestroyService);
    private readonly showLoader = inject(LoaderService).showLoader;

    readonly user = signal<UserMeta | null>(null);

    ngOnInit(): void {
        this.showLoader.set(true);
        this.supabaseService
            .getCurrentUser()
            .pipe(
                finalize(() => this.showLoader.set(false)),
                takeUntil(this.destroy$),
            )
            .subscribe({
                next: user => this.user.set(user),
                error: () => this.showGetUserError(),
            });
    }

    signOut(): void {
        this.supabaseService.signOut().subscribe(() => {
            this.router.navigate([Pages.Welcome]);
        });
    }

    private showGetUserError(): void {
        this.alertService
            .open('Непредвиденная ошибка при загрузке профиля', {status: 'error'})
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
}

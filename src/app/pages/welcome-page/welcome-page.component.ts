import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '@terralink-demo/ui';
import {Router} from '@angular/router';
import {Pages, SupabaseErrors} from '@terralink-demo/models';
import {TuiAlertService, TuiDialogService} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {ScannerComponent} from '../../dialogs/scanner/scanner.component';
import {finalize, takeUntil} from 'rxjs';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {ScannerConfirmComponent} from '../../dialogs/scanner-confirm/scanner-confirm.component';
import {SupabaseService} from '../../services/supabase.service';
import {LoaderService} from '../../services/loader.service';
import {NETWORK_ERROR} from '../../domain';
import {SvgIconComponent} from 'angular-svg-icon';

@Component({
    selector: 'welcome-page',
    standalone: true,
    imports: [CommonModule, ButtonComponent, SvgIconComponent],
    providers: [TuiDestroyService],
    templateUrl: './welcome-page.component.html',
    styleUrl: './welcome-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
    private readonly showLoader = inject(LoaderService).showLoader;
    private readonly supabaseService = inject(SupabaseService);
    private readonly alertService = inject(TuiAlertService);
    private readonly router = inject(Router);
    private readonly dialog = inject(TuiDialogService);
    private readonly destroy$ = inject(TuiDestroyService);

    openScanner(): void {
        this.dialog
            .open<string>(new PolymorpheusComponent(ScannerComponent), {
                size: 'page',
                closeable: false,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => res && this.openConfirm(res));
    }

    goToRegister(): void {
        this.router.navigate([Pages.Register]);
    }

    goToAuth(): void {
        this.router.navigate([Pages.Auth]);
    }

    private goToRules(): void {
        this.router.navigate([Pages.Rules]);
    }

    private openConfirm(email: string): void {
        this.dialog
            .open<boolean>(new PolymorpheusComponent(ScannerConfirmComponent), {
                size: 'page',
                data: email,
                dismissible: false,
                closeable: false,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => res && this.signQrCode(email));
    }

    private signQrCode(email: string): void {
        this.showLoader.set(true);
        this.supabaseService
            .signQr(email)
            .pipe(finalize(() => this.showLoader.set(false)))
            .subscribe({
                next: () => this.goToRules(),
                error: error => {
                    let message = 'Неизвестная ошибка, попробуйте позже';

                    switch (error) {
                        case SupabaseErrors.NetworkError:
                            message = NETWORK_ERROR;
                            break;
                        case SupabaseErrors.MetaError:
                            message = 'Не смогли найти пользователя по данному QR коду, попробуйте другой';
                            break;
                    }

                    this.alertService.open(message, {status: 'error'}).subscribe();
                },
            });
    }
}

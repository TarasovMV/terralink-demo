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
import {SupabaseService} from '../../services/supabase.service';
import {LoaderService} from '../../services/loader.service';
import {NETWORK_ERROR} from '../../domain';
import {SvgIconComponent} from 'angular-svg-icon';
import {trimUserQrCode} from '../../utils';

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
            .subscribe(res => res && this.signQrCode(res));
    }

    goToRegister(): void {
        this.router.navigate([Pages.Register]);
    }

    private goToRules(): void {
        this.router.navigate([Pages.Rules]);
    }

    private goToGame(): void {
        this.router.navigate([Pages.Game]);
    }

    private signQrCode(rawQr: string): void {
        const qrCode = trimUserQrCode(rawQr);

        if (!qrCode) {
            this.alertService
                .open('Использован неккоректный QR код', {
                    status: 'error',
                })
                .pipe(takeUntil(this.destroy$))
                .subscribe();

            return;
        }

        this.showLoader.set(true);
        this.supabaseService
            .signInQr(qrCode)
            .pipe(finalize(() => this.showLoader.set(false)))
            .subscribe({
                next: userExist => (userExist ? this.goToGame() : this.goToRules()),
                error: error => {
                    let message = 'Неизвестная ошибка, попробуйте позже';

                    switch (error) {
                        case SupabaseErrors.NetworkError:
                            message = NETWORK_ERROR;
                            break;
                        case SupabaseErrors.QrNotFound:
                            message = 'Не смогли найти пользователя по данному QR коду, попробуйте другой';
                            break;
                    }

                    this.alertService.open(message, {status: 'error'}).subscribe();
                },
            });
    }
}

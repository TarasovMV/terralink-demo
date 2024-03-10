import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '@terralink-demo/ui';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Pages, SupabaseErrors} from '@terralink-demo/models';
import {NETWORK_ERROR, PHONE_MASK, phoneValidator} from '../../domain';
import {MaskitoDirective} from '@maskito/angular';
import {SupabaseService} from '../../services/supabase.service';
import {clearPhoneNumber} from '../../utils';
import {TuiAlertService} from '@taiga-ui/core';
import {LoaderService} from '../../services/loader.service';
import {finalize} from 'rxjs';

@Component({
    selector: 'auth-page',
    standalone: true,
    imports: [CommonModule, ButtonComponent, ReactiveFormsModule, MaskitoDirective],
    templateUrl: './auth-page.component.html',
    styleUrl: './auth-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {
    private readonly router = inject(Router);
    private readonly supabaseService = inject(SupabaseService);
    private readonly alertService = inject(TuiAlertService);
    private readonly showLoader = inject(LoaderService).showLoader;

    readonly phoneMask = PHONE_MASK;
    readonly control = new FormControl<string>('', {validators: [phoneValidator('RU')], nonNullable: true});

    goToBack(): void {
        this.router.navigate([Pages.Welcome]);
    }

    checkControlError(): boolean {
        return !!this.control.errors && this.control.dirty && this.control.touched;
    }

    submitForm(): void {
        if (!this.control.valid) {
            this.control.markAsTouched();

            return;
        }

        const phone = clearPhoneNumber(this.control.value);

        this.showLoader.set(true);

        this.supabaseService
            .signInWithPhone(phone)
            .pipe(finalize(() => this.showLoader.set(false)))
            .subscribe({
                next: () => this.router.navigate([Pages.Game]),
                error: error => {
                    let message = 'Неизвестная ошибка авторизации';

                    switch (error) {
                        case SupabaseErrors.NetworkError:
                            message = NETWORK_ERROR;
                            break;
                        case SupabaseErrors.UserNotFound:
                            message = 'Пользователь не найден';
                            break;
                        case SupabaseErrors.SigninError:
                            message = 'Неправильный пароль';
                            break;
                    }

                    this.alertService
                        .open(message, {
                            status: 'error',
                        })
                        .subscribe();
                },
            });
    }
}

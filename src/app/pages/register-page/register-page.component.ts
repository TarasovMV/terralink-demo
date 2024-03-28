import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaskitoDirective} from '@maskito/angular';
import {NETWORK_ERROR, PHONE_MASK, phoneValidator} from '../../domain';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonComponent} from '@terralink-demo/ui';
import {Router} from '@angular/router';
import {Pages, SupabaseErrors, UserMeta} from '@terralink-demo/models';
import {SupabaseService} from '../../services/supabase.service';
import {clearPhoneNumber} from '../../utils';
import {LoaderService} from '../../services/loader.service';
import {TuiAlertService} from '@taiga-ui/core';
import {finalize} from 'rxjs';
import {TuiRadioLabeledModule} from '@taiga-ui/kit';

@Component({
    selector: 'register-page',
    standalone: true,
    imports: [CommonModule, MaskitoDirective, ReactiveFormsModule, ButtonComponent, TuiRadioLabeledModule],
    templateUrl: './register-page.component.html',
    styleUrl: './register-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
    private readonly router = inject(Router);
    private readonly supabaseService = inject(SupabaseService);
    private readonly showLoader = inject(LoaderService).showLoader;
    private readonly alertService = inject(TuiAlertService);

    readonly phoneMask = PHONE_MASK;
    readonly form = new FormGroup({
        fio: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
        phone: new FormControl<string>('', {validators: [phoneValidator('RU')], nonNullable: true}),
        email: new FormControl<string>('', {
            validators: [Validators.required, Validators.email],
            nonNullable: true,
        }),
        organization: new FormControl<string>(''),
        position: new FormControl<string>(''),
        musicGenre: new FormControl<string | null>(null),
        agreement: new FormControl<boolean>(false, {validators: [Validators.requiredTrue], nonNullable: true}),
    });

    goToBack(): void {
        this.router.navigate([Pages.Welcome]);
    }

    checkControlError(controlName: keyof typeof this.form.controls): boolean {
        const control = this.form.controls[controlName];

        return !!control.errors && control.touched;
    }

    submitForm(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            return;
        }

        const meta = this.mapToUserMeta(this.form.value);

        this.showLoader.set(true);

        this.supabaseService
            .signUpForm(meta)
            .pipe(finalize(() => this.showLoader.set(false)))
            .subscribe({
                next: qr => this.router.navigate([Pages.RegisterSuccess], {queryParams: {qr_code: qr}}),
                error: error => {
                    let message = 'Неизвестная ошибка при регистрации, попробуйте позже';

                    switch (error) {
                        case SupabaseErrors.NetworkError:
                            message = NETWORK_ERROR;
                            break;
                        case SupabaseErrors.UserAlreadyRegistered:
                            message = 'Такой пользователь уже зарегистрирован';
                            break;
                    }

                    this.alertService.open(message, {status: 'error'}).subscribe();
                },
            });
    }

    private mapToUserMeta(value: typeof this.form.value): UserMeta {
        return {
            fullname: value.fio!,
            email: value.email!,
            phone_number: clearPhoneNumber(value.phone!),
            organization: value.organization,
            position: value.position,
            music_genre: value.musicGenre,
        };
    }
}

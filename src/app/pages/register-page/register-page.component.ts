import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaskitoDirective} from '@maskito/angular';
import {PHONE_MASK, phoneValidator} from '../../domain';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonComponent} from '@terralink-demo/ui';
import {Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';

@Component({
    selector: 'register-page',
    standalone: true,
    imports: [CommonModule, MaskitoDirective, ReactiveFormsModule, ButtonComponent],
    templateUrl: './register-page.component.html',
    styleUrl: './register-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
    private readonly router = inject(Router);

    readonly phoneMask = PHONE_MASK;
    readonly form = new FormGroup({
        fio: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
        phone: new FormControl<string>('', {validators: [phoneValidator('RU')], nonNullable: true}),
        email: new FormControl<string>('', {validators: [Validators.required, Validators.email], nonNullable: true}),
        organization: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
        position: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
        agreement: new FormControl<boolean>(false, {validators: [Validators.required], nonNullable: true}),
    });

    goToBack(): void {
        this.router.navigate([Pages.Welcome]);
    }

    checkControlError(controlName: keyof typeof this.form.controls): boolean {
        const control = this.form.controls[controlName];

        return !!control.errors && control.dirty && control.touched;
    }

    submitForm(): void {
        console.log('form', this.form.valid, this.form.value);

        this.router.navigate([Pages.Rules]);
    }
}

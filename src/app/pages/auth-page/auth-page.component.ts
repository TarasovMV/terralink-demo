import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '@terralink-demo/ui';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';
import {PHONE_MASK, phoneValidator} from '../../domain';
import {MaskitoDirective} from '@maskito/angular';

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

    readonly phoneMask = PHONE_MASK;
    readonly control = new FormControl<string>('', {validators: [phoneValidator('RU')], nonNullable: true});

    goToBack(): void {
        this.router.navigate([Pages.Welcome]);
    }

    checkControlError(): boolean {
        return !!this.control.errors && this.control.dirty && this.control.touched;
    }

    submitForm(): void {
        this.router.navigate([Pages.Game]);
    }
}

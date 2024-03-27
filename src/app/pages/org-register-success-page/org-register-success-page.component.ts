import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '@terralink-demo/ui';
import {Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';

@Component({
    selector: 'org-register-success-page',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './org-register-success-page.component.html',
    styleUrl: './org-register-success-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrgRegisterSuccessPageComponent {
    private readonly router = inject(Router);

    submit(): void {
        this.router.navigate([Pages.Organizator]);
    }
}

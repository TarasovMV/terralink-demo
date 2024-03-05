import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '@terralink-demo/ui';
import {Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';

@Component({
    selector: 'welcome-page',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './welcome-page.component.html',
    styleUrl: './welcome-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
    private readonly router = inject(Router);

    goToRegister(): void {
        this.router.navigate([Pages.Register]);
    }
}

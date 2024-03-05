import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '@terralink-demo/ui';
import {Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';

@Component({
    selector: 'rules-page',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './rules-page.component.html',
    styleUrl: './rules-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesPageComponent {
    private readonly router = inject(Router);

    goToGame(): void {
        this.router.navigate([Pages.Game]);
    }
}

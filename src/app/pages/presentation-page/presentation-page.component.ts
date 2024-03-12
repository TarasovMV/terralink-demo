import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';
import {ButtonComponent} from '@terralink-demo/ui';

@Component({
    selector: 'presentation-page',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './presentation-page.component.html',
    styleUrl: './presentation-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresentationPageComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly index = this.route.snapshot.queryParamMap.get('id');

    back(): void {
        this.router.navigate([Pages.Game], {queryParams: {id: this.index}});
    }
}

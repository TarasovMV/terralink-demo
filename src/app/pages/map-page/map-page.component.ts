import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SvgIconComponent} from 'angular-svg-icon';
import {TuiPanModule} from '@taiga-ui/cdk';
import {ButtonComponent} from '@terralink-demo/ui';
import {ActivatedRoute, Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';
import {MapComponent} from '../../components/map/map.component';

@Component({
    selector: 'map-page',
    standalone: true,
    imports: [CommonModule, MapComponent, SvgIconComponent, TuiPanModule, ButtonComponent],
    templateUrl: './map-page.component.html',
    styleUrl: './map-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPageComponent {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly index = this.route.snapshot.queryParamMap.get('id');

    // TODO: add index to path
    readonly mapPath = `assets/maps/map.svg`;

    back(): void {
        this.router.navigate([Pages.Game], {queryParams: {id: this.index}});
    }
}

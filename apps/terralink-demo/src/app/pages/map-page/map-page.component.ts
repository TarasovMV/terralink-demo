import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SvgIconComponent} from 'angular-svg-icon';
import {TuiPanModule} from '@taiga-ui/cdk';
import {ButtonComponent} from '@terralink-demo/ui';
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
    readonly mapPath = `assets/maps/map.svg`;
}

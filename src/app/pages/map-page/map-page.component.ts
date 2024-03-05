import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'map-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './map-page.component.html',
    styleUrl: './map-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPageComponent {}

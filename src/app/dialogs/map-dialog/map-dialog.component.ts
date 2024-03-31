import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MapComponent} from '../../components/map/map.component';
import {ButtonComponent} from '@terralink-demo/ui';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';

@Component({
    selector: 'map-dialog',
    standalone: true,
    imports: [CommonModule, MapComponent, ButtonComponent],
    templateUrl: './map-dialog.component.html',
    styleUrl: './map-dialog.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapDialogComponent {
    private readonly context = inject(POLYMORPHEUS_CONTEXT) as TuiDialogContext<void, number>;
    readonly standId = this.context.data;

    back(): void {
        this.context.completeWith();
    }
}

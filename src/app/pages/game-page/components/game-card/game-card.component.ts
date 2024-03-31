import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '@terralink-demo/ui';
import {SvgIconComponent} from 'angular-svg-icon';
import {StandMeta} from '@terralink-demo/models';

@Component({
    selector: 'game-card',
    standalone: true,
    imports: [CommonModule, ButtonComponent, SvgIconComponent],
    templateUrl: './game-card.component.html',
    styleUrl: './game-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {
    @Input({required: true}) data!: StandMeta;
    @Input() done: undefined | boolean = false;

    @Output() readonly openMap = new EventEmitter<void>();
    @Output() readonly openPresentation = new EventEmitter<void>();

    get statusText(): string {
        return this.done ? 'Фрагмент получен' : 'Фрагмент не получен';
    }

    openMapClick(e: Event): void {
        e.stopPropagation();

        this.openMap.emit();
    }
}

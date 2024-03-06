import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '@terralink-demo/ui';
import {SvgIconComponent} from 'angular-svg-icon';
import {CardMeta} from '../../domain';

@Component({
    selector: 'game-card',
    standalone: true,
    imports: [CommonModule, ButtonComponent, SvgIconComponent],
    templateUrl: './game-card.component.html',
    styleUrl: './game-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {
    @Input({required: true}) data!: CardMeta;
    @Output() readonly openMap = new EventEmitter<void>();

    get statusText(): string {
        return this.data.done ? 'Фрагмент получен' : 'Фрагмент не получен';
    }
}

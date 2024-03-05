import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'game-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game-card.component.html',
    styleUrl: './game-card.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {}

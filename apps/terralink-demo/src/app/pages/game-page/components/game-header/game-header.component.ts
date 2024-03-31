import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'game-header',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game-header.component.html',
    styleUrl: './game-header.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameHeaderComponent {}

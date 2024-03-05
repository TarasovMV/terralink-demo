import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'game-pager',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game-pager.component.html',
    styleUrl: './game-pager.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePagerComponent {
    @Input() count = 0;
    @Input() activeIdx = 0;

    get pages(): number[] {
        return Array.from(Array(this.count)).map((_, idx) => (idx === this.activeIdx ? 1 : 0));
    }
}

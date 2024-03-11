import {ChangeDetectionStrategy, Component, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'game-play',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game-play.component.html',
    styleUrl: './game-play.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        '(click)': 'playPause()',
    },
})
export class GamePlayComponent {
    @Input() progress = 0;

    readonly status = signal<'play' | 'pause'>('play');

    get progressArray() {
        return Array(this.progress)
            .fill(null)
            .map((_, idx) => idx < this.progress);
    }

    playPause(): void {
        this.status.update(v => (v === 'play' ? 'pause' : 'play'));
    }
}

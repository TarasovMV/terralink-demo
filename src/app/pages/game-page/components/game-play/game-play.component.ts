import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, signal} from '@angular/core';
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
    @Input() set progress(value: number) {
        if (!value) {
            return;
        }

        this.progressCount = value;
        this.progressArray = Array(value)
            .fill(null)
            .map((_, idx) => idx < value);

        value && this.play();
    }
    @Input() count = 0;

    private readonly cdRef = inject(ChangeDetectorRef);
    private audio = new Audio();
    private progressCount = 0;
    readonly status = signal<'play' | 'pause'>('play');
    progressArray: boolean[] = [];

    private get audioSrc(): string {
        if (this.count === this.progressCount) {
            return `assets/sounds/complete.mp3`;
        }
        return `assets/sounds/${this.progressCount}.mp3`;
    }

    constructor() {
        this.audio.onended = () => {
            this.status.set('play');
        };
    }

    playPause(): void {
        if (this.status() === 'play') {
            this.play();
            return;
        }

        this.pause();
    }

    private play(): void {
        if (!this.progressCount) {
            return;
        }

        this.audio.src = this.audioSrc;
        this.progress = 0;
        this.audio.play();

        this.status.set('pause');
    }

    private pause(): void {
        this.audio.pause();
        this.progress = 0;

        this.status.set('play');
    }
}

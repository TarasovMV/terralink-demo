import {ChangeDetectionStrategy, Component, effect, inject, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GameService} from '../../../../services/game.service';

const DEFAULT_GENRE = 'rock';
const MUSIC_GENRES: {[key: string]: string} = {
    ['рок']: 'rock',
    ['классика']: 'classic',
    ['джаз']: 'jazz',
};

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
    @Input({required: true}) genre: string | null = null;

    private readonly forcePlay = inject(GameService).forcePlayMusic;
    private audio = new Audio();
    readonly status = signal<'play' | 'pause'>('play');

    private get audioSrc(): string {
        const genre = MUSIC_GENRES[this.genre?.toLowerCase() ?? ''] ?? DEFAULT_GENRE;
        return `assets/sounds/${genre}/${this.progress}.mp3`;
    }

    constructor() {
        effect(() => {
            this.forcePlay() && this.play();
        });

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
        if (!this.progress) {
            return;
        }

        this.audio.src = this.audioSrc;
        this.audio.currentTime = 0;
        this.audio.play().then(() => this.status.set('pause'));
    }

    private pause(): void {
        this.audio.pause();
        this.audio.currentTime = 0;

        this.status.set('play');
    }
}

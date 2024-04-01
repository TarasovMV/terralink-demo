import {ChangeDetectionStrategy, Component, ElementRef, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SvgIconComponent} from 'angular-svg-icon';

@Component({
    selector: 'game-progress-button',
    standalone: true,
    imports: [CommonModule, SvgIconComponent],
    templateUrl: './game-progress-button.component.html',
    styleUrl: './game-progress-button.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameProgressButtonComponent {
    @Input() progress = 1 / 16;
    private readonly hostRef = inject(ElementRef).nativeElement;

    private get buttonWidth(): number {
        return this.hostRef.clientWidth || 0;
    }

    get progressPx(): number {
        return Math.ceil(this.buttonWidth * this.progress);
    }
}

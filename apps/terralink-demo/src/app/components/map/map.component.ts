import {AfterViewInit, ChangeDetectionStrategy, Component, Input, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SvgIconComponent} from 'angular-svg-icon';

const SVG_CONFIG = {
    width: 800,
    height: 535,
};

@Component({
    selector: 'map',
    standalone: true,
    imports: [CommonModule, SvgIconComponent],
    templateUrl: './map.component.html',
    styleUrl: './map.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
    @Input() standId: number | undefined;

    readonly svgWidth = signal<number>(0);
    readonly svgHeight = signal<number>(0);

    private get containerEl(): Element {
        return document.getElementsByClassName('container')[0];
    }

    get mapPath(): string {
        if (this.standId) {
            return `assets/maps/stands/map_${this.standId}.svg`;
        }
        return `assets/maps/map.svg`;
    }

    ngAfterViewInit(): void {
        setTimeout(() => this.initMap(), 100);
    }

    private initMap(): void {
        const height = this.containerEl.getBoundingClientRect().height;
        const width = (height / SVG_CONFIG.height) * SVG_CONFIG.width;
        const offset = (width - window.outerWidth) / 2;

        this.svgWidth.set(width);
        this.svgHeight.set(height);

        setTimeout(() => this.containerEl.scrollTo({left: offset}));
    }
}

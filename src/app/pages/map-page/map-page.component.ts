import {AfterViewInit, ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SvgIconComponent} from 'angular-svg-icon';
import {TuiPanModule} from '@taiga-ui/cdk';
import {ButtonComponent} from '@terralink-demo/ui';
import {ActivatedRoute, Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';

const SVG_CONFIG = {
    width: 800,
    height: 535,
};

@Component({
    selector: 'map-page',
    standalone: true,
    imports: [CommonModule, SvgIconComponent, TuiPanModule, ButtonComponent],
    templateUrl: './map-page.component.html',
    styleUrl: './map-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPageComponent implements AfterViewInit {
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly index = this.route.snapshot.queryParamMap.get('id');

    readonly svgWidth = signal<number>(0);
    readonly svgHeight = signal<number>(0);

    // TODO: add index to path
    readonly mapPath = `assets/maps/map.svg`;

    private get containerEl(): Element {
        return document.getElementsByClassName('container')[0];
    }

    ngAfterViewInit(): void {
        this.initMap();
    }

    back(): void {
        this.router.navigate([Pages.Game], {queryParams: {id: this.index}});
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

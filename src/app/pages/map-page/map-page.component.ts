import {AfterViewInit, ChangeDetectionStrategy, Component, inject, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SvgIconComponent} from 'angular-svg-icon';
import {TuiPanModule} from '@taiga-ui/cdk';
import {ButtonComponent} from '@terralink-demo/ui';
import {ActivatedRoute, Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';
import {MutationObserverModule} from '@ng-web-apis/mutation-observer';

@Component({
    selector: 'map-page',
    standalone: true,
    imports: [CommonModule, SvgIconComponent, TuiPanModule, ButtonComponent],
    templateUrl: './map-page.component.html',
    styleUrl: './map-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapPageComponent implements AfterViewInit {
    @ViewChild(SvgIconComponent) icon!: SvgIconComponent;

    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly index = this.route.snapshot.queryParamMap.get('id');

    ngAfterViewInit(): void {
        this.scrollToCenter();
        console.log(this.icon);
    }

    load(e: any) {
        console.log(e);
    }

    back(): void {
        this.router.navigate([Pages.Game], {queryParams: {id: this.index}});
    }

    private scrollToCenter(): void {
        const offset = (800 - window.outerWidth) / 2;
        document.getElementsByClassName('container')[0].scrollTo({left: offset, behavior: 'smooth'});
    }
}

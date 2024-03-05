import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiCarouselModule} from '@taiga-ui/kit';
import {GameCardComponent} from '@terralink-demo/pages/game-page/components/game-card/game-card.component';
import {GamePagerComponent} from '@terralink-demo/pages/game-page/components/game-pager/game-pager.component';

@Component({
    selector: 'game-page',
    standalone: true,
    imports: [CommonModule, TuiCarouselModule, GameCardComponent, GamePagerComponent],
    templateUrl: './game-page.component.html',
    styleUrl: './game-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamePageComponent {
    cardIndex = 0;
}

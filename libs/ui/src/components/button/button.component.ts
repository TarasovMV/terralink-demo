import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiRippleModule} from '@taiga-ui/addon-mobile';
import {SvgIconComponent} from 'angular-svg-icon';

@Component({
    selector: 'ui-button',
    standalone: true,
    imports: [CommonModule, TuiRippleModule, SvgIconComponent],
    templateUrl: './button.component.html',
    styleUrl: './button.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
    @Input() type: 'primary' | 'secondary' | 'close' | 'close-black' | 'card' = 'primary';
}

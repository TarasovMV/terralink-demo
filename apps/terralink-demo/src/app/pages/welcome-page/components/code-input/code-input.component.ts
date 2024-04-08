import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MaskitoDirective} from '@maskito/angular';
import {MaskitoOptions} from '@maskito/core';

@Component({
    selector: 'code-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MaskitoDirective],
    templateUrl: './code-input.component.html',
    styleUrl: './code-input.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeInputComponent {
    readonly control1 = new FormControl<number | null>(null);
    readonly control2 = new FormControl<number | null>(null);
    readonly control3 = new FormControl<number | null>(null);
    readonly control4 = new FormControl<number | null>(null);

    readonly mask: MaskitoOptions = {
        mask: [/\d/],
    };
}

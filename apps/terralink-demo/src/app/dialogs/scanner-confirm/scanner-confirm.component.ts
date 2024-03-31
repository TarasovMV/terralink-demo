import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {ButtonComponent} from '@terralink-demo/ui';

@Component({
    selector: 'scanner-confirm',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './scanner-confirm.component.html',
    styleUrl: './scanner-confirm.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScannerConfirmComponent {
    private readonly context = inject(POLYMORPHEUS_CONTEXT) as TuiDialogContext<boolean, string>;
    readonly email = this.context.data;

    accept(): void {
        this.context.completeWith(true);
    }

    cancel(): void {
        this.context.completeWith(false);
    }
}

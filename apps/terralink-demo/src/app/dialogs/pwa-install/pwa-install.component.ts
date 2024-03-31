import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '@terralink-demo/ui';
import {TuiDialogContext} from '@taiga-ui/core';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';

@Component({
    selector: 'pwa-install',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './pwa-install.component.html',
    styleUrl: './pwa-install.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PwaInstallComponent {
    private readonly context = inject(POLYMORPHEUS_CONTEXT) as TuiDialogContext<boolean, void>;

    close(): void {
        this.context.completeWith(false);
    }

    install(): void {
        this.context.completeWith(true);
    }
}

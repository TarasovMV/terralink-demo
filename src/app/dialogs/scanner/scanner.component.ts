import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {BarcodeFormat} from '@zxing/library';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import Result from '@zxing/library/esm/core/Result';
import {TuiDialogContext} from '@taiga-ui/core';

@Component({
    selector: 'scanner',
    standalone: true,
    imports: [CommonModule, ZXingScannerModule],
    templateUrl: './scanner.component.html',
    styleUrl: './scanner.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScannerComponent {
    private readonly context = inject(POLYMORPHEUS_CONTEXT) as TuiDialogContext<string>;
    readonly allowedFormats = [BarcodeFormat.QR_CODE];

    handleScan(code: Result | undefined): void {
        const result = code?.getText();

        if (!result) {
            return;
        }

        this.context.completeWith(result);
    }
}

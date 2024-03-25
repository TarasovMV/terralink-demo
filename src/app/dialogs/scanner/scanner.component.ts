import {AfterViewInit, ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {BarcodeFormat} from '@zxing/library';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import Result from '@zxing/library/esm/core/Result';
import {TuiDialogContext} from '@taiga-ui/core';
import {ButtonComponent} from '@terralink-demo/ui';
import {Html5Qrcode} from 'html5-qrcode';

@Component({
    selector: 'scanner',
    standalone: true,
    imports: [CommonModule, ZXingScannerModule, ButtonComponent],
    templateUrl: './scanner.component.html',
    styleUrl: './scanner.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScannerComponent implements AfterViewInit {
    private readonly context = inject(POLYMORPHEUS_CONTEXT) as TuiDialogContext<string | null>;
    readonly allowedFormats = [BarcodeFormat.QR_CODE];

    ngAfterViewInit(): void {
        const aspectRatio = window.innerWidth / window.innerHeight;
        const scanner = new Html5Qrcode('reader');

        scanner.start(
            {facingMode: 'environment'},
            {fps: 10, qrbox: 250, aspectRatio},
            res => this.handleScan(res),
            err => true,
        );
    }

    handleScan(code: string): void {
        if (!code) {
            return;
        }

        this.context.completeWith(code);
    }

    close(): void {
        this.context.completeWith(null);
    }
}

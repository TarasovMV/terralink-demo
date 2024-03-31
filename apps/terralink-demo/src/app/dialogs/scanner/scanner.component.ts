import {AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy} from '@angular/core';
import {CommonModule} from '@angular/common';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';
import {TuiDialogContext} from '@taiga-ui/core';
import {ButtonComponent} from '@terralink-demo/ui';
import {Html5Qrcode} from 'html5-qrcode';

@Component({
    selector: 'scanner',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './scanner.component.html',
    styleUrl: './scanner.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScannerComponent implements AfterViewInit, OnDestroy {
    private readonly context = inject(POLYMORPHEUS_CONTEXT) as TuiDialogContext<string | null>;
    scanner!: Html5Qrcode;

    ngAfterViewInit(): void {
        // const aspectRatio = window.innerHeight / window.innerWidth;
        this.scanner = new Html5Qrcode('reader');

        this.scanner.start(
            {facingMode: 'environment'},
            {fps: 10, qrbox: 250}, // TODO: aspect ratio
            res => this.handleScan(res),
            err => true,
        );
    }

    ngOnDestroy(): void {
        this.scanner.stop().then();
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

import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '@terralink-demo/ui';
import {Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';
import {TuiDialogService} from '@taiga-ui/core';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {ScannerComponent} from '../../dialogs/scanner/scanner.component';
import {switchMap, switchScan, takeUntil} from 'rxjs';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {ScannerConfirmComponent} from '../../dialogs/scanner-confirm/scanner-confirm.component';

@Component({
    selector: 'welcome-page',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    providers: [TuiDestroyService],
    templateUrl: './welcome-page.component.html',
    styleUrl: './welcome-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
    private readonly router = inject(Router);
    private readonly dialog = inject(TuiDialogService);
    private readonly destroy$ = inject(TuiDestroyService);

    openScanner(): void {
        this.dialog
            .open<string>(new PolymorpheusComponent(ScannerComponent), {
                size: 'page',
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => res && this.openConfirm(res));
    }

    goToRegister(): void {
        this.router.navigate([Pages.Register]);
    }

    private openConfirm(email: string): void {
        this.dialog
            .open<boolean>(new PolymorpheusComponent(ScannerConfirmComponent), {
                size: 'page',
                data: email,
                dismissible: false,
                closeable: false,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
}

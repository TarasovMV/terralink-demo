import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonComponent} from '@terralink-demo/ui';
import {SvgIconComponent} from 'angular-svg-icon';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {ScannerComponent} from '../../dialogs/scanner/scanner.component';
import {takeUntil} from 'rxjs';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {TuiDialogService} from '@taiga-ui/core';
import {Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';

@Component({
    selector: 'organizator-page',
    standalone: true,
    imports: [CommonModule, ButtonComponent, SvgIconComponent],
    templateUrl: './organizator-page.component.html',
    styleUrl: './organizator-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizatorPageComponent {
    private readonly router = inject(Router);
    private readonly dialog = inject(TuiDialogService);
    private readonly destroy$ = inject(TuiDestroyService);

    scanQr(): void {
        this.dialog
            .open<string>(new PolymorpheusComponent(ScannerComponent), {
                size: 'page',
                closeable: false,
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => res && this.router.navigate([Pages.OrganizatorMark], {queryParams: {user: res}}));
    }

    register(): void {}
}

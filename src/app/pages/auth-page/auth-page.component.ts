import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScannerComponent} from '../../dialogs/scanner/scanner.component';

@Component({
    selector: 'auth-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './auth-page.component.html',
    styleUrl: './auth-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {}

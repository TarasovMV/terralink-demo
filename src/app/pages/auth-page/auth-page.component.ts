import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'auth-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './auth-page.component.html',
    styleUrl: './auth-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {}

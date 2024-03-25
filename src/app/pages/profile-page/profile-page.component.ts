import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QRCodeModule} from 'angularx-qrcode';

@Component({
    selector: 'profile-page',
    standalone: true,
    imports: [CommonModule, QRCodeModule],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {}

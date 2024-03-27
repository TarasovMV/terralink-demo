import {ChangeDetectionStrategy, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from '../../components/footer/footer.component';

@Component({
    selector: 'main-page',
    standalone: true,
    imports: [CommonModule, FooterComponent, RouterOutlet],
    templateUrl: './main-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {}

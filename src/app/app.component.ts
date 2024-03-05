import {TuiRootModule, TuiDialogModule} from '@taiga-ui/core';
import {Component} from '@angular/core';
import {RouterModule} from '@angular/router';

@Component({
    standalone: true,
    imports: [RouterModule, TuiRootModule, TuiDialogModule],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
})
export class AppComponent {
    constructor() {
        // TODO: refactor service
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        window.addEventListener('resize', () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    }
}

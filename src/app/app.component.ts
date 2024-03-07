import {TuiRootModule, TuiDialogModule, TuiLoaderModule} from '@taiga-ui/core';
import {Component, inject} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoaderService} from './services/loader.service';

@Component({
    standalone: true,
    imports: [RouterModule, TuiRootModule, TuiDialogModule, TuiLoaderModule],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
})
export class AppComponent {
    readonly showLoader = inject(LoaderService).showLoader;

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

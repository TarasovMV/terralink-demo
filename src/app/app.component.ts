import {TuiRootModule, TuiDialogModule, TuiLoaderModule, TuiAlertModule, TuiAlertService} from '@taiga-ui/core';
import {Component, HostListener, inject, signal} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoaderService} from './services/loader.service';

@Component({
    standalone: true,
    imports: [RouterModule, TuiRootModule, TuiDialogModule, TuiAlertModule, TuiLoaderModule],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
})
export class AppComponent {
    readonly showLoader = inject(LoaderService).showLoader;
    readonly showPwaInstall = signal(false);
    readonly alertService = inject(TuiAlertService);
    promptEvent: any;

    constructor() {
        // TODO: refactor service
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);

        window.addEventListener('resize', () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        });
    }

    @HostListener('window:beforeinstallprompt', ['$event'])
    onbeforeinstallprompt(e: Event) {
        e.preventDefault();
        this.promptEvent = e;

        if (e) {
            this.alertService.open('pwa ready').subscribe();
        }
    }

    // installPWA() {
    //     this.promptEvent.prompt();
    // }
    //
    // shouldInstall(): boolean {
    //     const;
    //
    //     return !this.isRunningStandalone() && this.promptEvent;
    // }
    //
    // isRunningStandalone(): boolean {
    //     return window.matchMedia('(display-mode: standalone)').matches;
    // }
}

import {
    TuiRootModule,
    TuiDialogModule,
    TuiLoaderModule,
    TuiAlertModule,
    TuiAlertService,
    TuiDialogService,
} from '@taiga-ui/core';
import {Component, HostListener, inject, signal} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoaderService} from './services/loader.service';
import {PolymorpheusComponent} from '@tinkoff/ng-polymorpheus';
import {PwaInstallComponent} from './dialogs/pwa-install/pwa-install.component';
import {TuiDestroyService} from '@taiga-ui/cdk';

@Component({
    standalone: true,
    imports: [RouterModule, TuiRootModule, TuiDialogModule, TuiAlertModule, TuiLoaderModule],
    providers: [TuiDestroyService],
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.less',
})
export class AppComponent {
    private readonly dialog = inject(TuiDialogService);
    private readonly destroy$ = inject(TuiDialogService);

    readonly showLoader = inject(LoaderService).showLoader;
    readonly alertService = inject(TuiAlertService);

    promptEvent: any;

    get isRunningStandalone(): boolean {
        return window.matchMedia('(display-mode: standalone)').matches;
    }

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

        if (e && !this.isRunningStandalone) {
            this.openPwaInstall();
        }
    }

    private openPwaInstall(): void {
        console.log('install');
        this.dialog
            .open<boolean>(new PolymorpheusComponent(PwaInstallComponent), {
                size: 'page',
                dismissible: false,
                closeable: false,
            })
            .subscribe(res => res && this.promptEvent.prompt());
    }
}

import {Injectable, signal} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    showLoader = signal<boolean>(false);
}

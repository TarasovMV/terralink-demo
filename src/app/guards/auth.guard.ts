import {finalize, map, tap} from 'rxjs';
import {inject} from '@angular/core';
import {LoaderService} from '../services/loader.service';
import {SupabaseService} from '../services/supabase.service';
import {Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';

export const authGuard = () => {
    const showLoader = inject(LoaderService).showLoader;
    const supabaseService = inject(SupabaseService);
    const router = inject(Router);

    showLoader.set(true);

    return supabaseService.getSession().pipe(
        tap(s => console.log(s)),
        map(session => (session ? true : router.createUrlTree([Pages.Welcome]))),
        finalize(() => showLoader.set(false)),
    );
};

import {finalize, map} from 'rxjs';
import {inject} from '@angular/core';
import {LoaderService} from '../services/loader.service';
import {SupabaseService} from '../services/supabase.service';
import {Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';

export const alreadyAuthGuard = () => {
    const showLoader = inject(LoaderService).showLoader;
    const supabaseService = inject(SupabaseService);
    const router = inject(Router);

    showLoader.set(true);

    return supabaseService.getSession().pipe(
        map(session => (session ? router.createUrlTree([Pages.Game]) : true)),
        finalize(() => showLoader.set(false)),
    );
};

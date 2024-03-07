import {Injectable} from '@angular/core';
import {AuthSession, createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../environment';
import {catchError, from, map, of, switchMap, tap, throwError} from 'rxjs';
import {UserMeta} from '@terralink-demo/models';

const SERVICE_PASS = '7>1C;_Fgy$J^6?£N-Jw)c';

@Injectable({
    providedIn: 'root',
})
export class SupabaseService {
    private readonly supabase: SupabaseClient;
    session: AuthSession | null = null;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

    getSession() {
        return from(this.supabase.auth.getSession()).pipe(
            map(res => res.data.session),
            tap(res => (this.session = res)),
        );
    }

    signQr(email: string) {
        return this.checkProfileByEmail(email).pipe(
            switchMap(alreadyExist => (alreadyExist ? this.signIn(email) : this.fullSignUp(email))),
        );
    }

    private fullSignUp(email: string) {
        return this.getServiceMeta(email).pipe(
            switchMap(res => (!res ? throwError(() => 'META_ERROR') : of(res))),
            switchMap(res => this.signUp(email).pipe(map(user_id => ({...res, user_id})))),
            switchMap(res => this.signIn(email).pipe(map(user_id => ({...res, user_id})))),
            switchMap(res => this.postUserMeta(res)),
        );
    }

    private signUp(email: string) {
        return from(this.supabase.auth.signUp({email, password: SERVICE_PASS})).pipe(
            switchMap(res => {
                const userId = res.data.user?.id;

                if (!userId) {
                    return throwError(() => 'SIGNUP_ERROR');
                }

                return of(userId);
            }),
        );
    }

    private postUserMeta(meta: UserMeta) {
        return from(this.supabase.from('user_meta').insert(meta));
    }

    private getServiceMeta(email: string) {
        return from(this.supabase.from('service_meta').select('*').eq('email', email).single()).pipe(
            map(({data}) => {
                if (!data) {
                    return null;
                }

                delete data.id;

                return data;
            }),
            catchError(() => of(null)),
        );
    }

    private signIn(email: string) {
        return from(this.supabase.auth.signInWithPassword({email, password: SERVICE_PASS}));
    }

    private signOut() {
        return from(this.supabase.auth.signOut());
    }

    private checkProfileByEmail(email: string) {
        return from(this.supabase.from('user_meta').select(`email`).eq('email', email).single()).pipe(
            map(({data}) => !!data),
        );
    }

    private getAllProfiles() {
        return from(this.supabase.from('user_meta').select(`*`));
    }
}

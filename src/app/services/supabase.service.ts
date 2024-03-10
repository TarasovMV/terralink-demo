import {Injectable} from '@angular/core';
import {AuthSession, createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../environment';
import {catchError, from, map, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {SupabaseErrors, UserMeta} from '@terralink-demo/models';
import {clearPhoneNumber} from '../utils';

const SERVICE_PASS = '7>1C;_Fgy$J^6?£N-Jw)c';

@Injectable({
    providedIn: 'root',
})
export class SupabaseService {
    private readonly supabase: SupabaseClient;
    session: AuthSession | null = null;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

        // this.signOut();
        // this.getAllProfiles().subscribe(x => console.log(x));
        // this.updateProfile();
    }

    getSession() {
        return from(this.supabase.auth.getSession()).pipe(
            map(res => res.data.session),
            tap(res => (this.session = res)),
        );
    }

    signQr(email: string) {
        return this.checkProfileByField('email', email).pipe(
            switchMap(alreadyExist => (alreadyExist ? this.signIn(email) : this.fullSignUp(email))),
        );
    }

    signInWithPhone(phone: string) {
        return this.checkProfileByField('phone_number', phone).pipe(
            switchMap(email => (email ? of(email) : throwError(() => SupabaseErrors.UserNotFound))),
            switchMap(email => this.signIn(email)),
        );
    }

    fullSignUp(email: string, meta?: UserMeta) {
        return (meta ? of(meta) : this.getServiceMeta(email)).pipe(
            switchMap(res => (!res ? throwError(() => SupabaseErrors.MetaError) : of(res))),
            switchMap(res =>
                this.signUp(email).pipe(
                    map(user_id => ({...res, user_id, phone_number: clearPhoneNumber(res.phone_number)})),
                ),
            ),
            switchMap(res => this.signIn(email).pipe(map(() => res))),
            switchMap(res => this.postUserMeta(res)),
        );
    }

    private signUp(email: string) {
        return this.fromSupabase(this.supabase.auth.signUp({email, password: SERVICE_PASS})).pipe(
            switchMap(res => {
                const userId = res.data.user?.id;

                if (res.error?.message === 'User already registered') {
                    return throwError(() => SupabaseErrors.UserAlreadyRegistered);
                }

                if (!userId) {
                    return throwError(() => SupabaseErrors.SignupError);
                }

                return of(userId);
            }),
        );
    }

    private postUserMeta(meta: UserMeta) {
        return this.fromSupabase(this.supabase.from('user_meta').insert(meta));
    }

    private getServiceMeta(email: string) {
        return this.fromSupabase(this.supabase.from('service_meta').select('*').eq('email', email).single()).pipe(
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
        return this.fromSupabase(this.supabase.auth.signInWithPassword({email, password: SERVICE_PASS})).pipe(
            switchMap(res => {
                if (!res.data.user?.id) {
                    return throwError(() => 'SIGNIN_ERROR');
                }

                return of(res);
            }),
        );
    }

    signOut() {
        return from(this.supabase.auth.signOut());
    }

    private checkProfileByField(field: 'email' | 'phone_number', value: string): Observable<string | null> {
        return this.fromSupabase(this.supabase.from('user_meta').select(`email`).eq(field, value).single()).pipe(
            map(({data}) => data?.email),
        );
    }

    private getAllProfiles() {
        return from(this.supabase.from('user_meta').select(`*`));
    }

    private fromSupabase<T extends PromiseLike<any>>(request: T) {
        return from(request).pipe(
            switchMap(res => {
                if (res.error?.message === 'Failed to fetch') {
                    return throwError(() => SupabaseErrors.NetworkError);
                }

                return of(res);
            }),
        );
    }
}

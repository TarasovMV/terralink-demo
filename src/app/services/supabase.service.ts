import {Injectable} from '@angular/core';
import {AuthSession, createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../environment';
import {catchError, delay, forkJoin, from, map, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {CardInfo, CardMeta, SupabaseErrors, UserMeta} from '@terralink-demo/models';
import {clearPhoneNumber} from '../utils';
import {CARDS} from '../domain/cards.const';
import {USER_MOCK} from '../domain';

const SERVICE_PASS = '7>1C;_Fgy$J^6?£N-Jw)c';

@Injectable({
    providedIn: 'root',
})
export class SupabaseService {
    private readonly supabase: SupabaseClient;
    session: AuthSession | null = null;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

        this.fromSupabase(this.supabase.from('user_presentation').select('*'))
            .pipe()
            .subscribe(res => console.log(res));

        // this.signOut();
        // this.getAllProfiles().subscribe(x => console.log(x));
        // this.updateProfile();
    }

    getUserById(id: number): Observable<UserMeta> {
        return of({...USER_MOCK} as UserMeta).pipe(delay(500));
    }

    getStands(): Observable<CardMeta[]> {
        return of([...CARDS]);
    }

    requestPresentation(id: number, email: string): Observable<unknown> {
        return from(
            this.supabase.from('user_presentation').insert({stand_id: id, email, user_id: this.session!.user.id}),
        );
    }

    checkPresentation(id: number): Observable<boolean> {
        return this.fromSupabase(
            this.supabase.from('user_presentation').select('*').match({user_id: this.session!.user.id, stand_id: id}),
        ).pipe(map(({data}) => !!data?.length));
    }

    getCardsInfo(): Observable<CardInfo[]> {
        return from(this.supabase.from('user_stand').select('*').eq('user_id', this.session!.user.id)).pipe(
            map(res => res?.data ?? []),
        );
    }

    setCardDone(cardId: number): Observable<unknown> {
        return from(this.supabase.from('user_stand').insert({stand_id: cardId, user_id: this.session!.user.id}));
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
                forkJoin([
                    this.checkProfileByField('email', email),
                    this.checkProfileByField('phone_number', clearPhoneNumber(res.phone_number)),
                ]).pipe(
                    switchMap(([checkEmail, checkPhone]) =>
                        !checkEmail && !checkPhone ? of(res) : throwError(() => SupabaseErrors.UserAlreadyRegistered),
                    ),
                ),
            ),
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
        return from(this.supabase.from('user_meta').select(`*`).eq('phone_number', '+79255999987'));
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

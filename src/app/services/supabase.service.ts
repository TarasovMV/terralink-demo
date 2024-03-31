import {Injectable} from '@angular/core';
import {AuthSession, createClient, SupabaseClient} from '@supabase/supabase-js';
import {environment} from '../../environment';
import {from, map, Observable, of, switchMap, tap, throwError} from 'rxjs';
import {CardInfo, StandMeta, SupabaseErrors, UserMeta, ProductMeta, ProductGroupMeta} from '@terralink-demo/models';
import {clearPhoneNumber, getEmail, getQrCode} from '../utils';

const SERVICE_PASS = '7>1C;_Fgy$J^6?£N-Jw)c';

@Injectable({
    providedIn: 'root',
})
export class SupabaseService {
    private readonly supabase: SupabaseClient;
    private readonly cache = new Map<string, any>();

    session: AuthSession | null = null;

    constructor() {
        this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

        // this.fromSupabase(this.supabase.from('user_presentation').select('*'))
        //     .pipe()
        //     .subscribe(res => console.log(res));

        // this.signOut();
        // this.getAllProfiles().subscribe(x => console.log(x));
        // this.updateProfile();
    }

    signOut() {
        return from(this.supabase.auth.signOut());
    }

    signUpForm(meta: UserMeta, signIn = true): Observable<number> {
        let qrCode = 0;
        let userEmail = '';

        return this.getUsedQrs().pipe(
            map(qrs => getQrCode(qrs)),
            tap(qr => (qrCode = qr)),
            map(qr => getEmail(qr)),
            tap(email => (userEmail = email)),
            switchMap(email => this.signUp(email)),
            map(user_id => ({...meta, user_id, qr_code: qrCode, phone_number: clearPhoneNumber(meta.phone_number)})),
            switchMap(res => this.postUserMeta(res)),
            switchMap(() => (signIn ? this.signIn(userEmail) : of(null))),
            map(() => qrCode),
        );
    }

    signInQr(qrCode: number): Observable<boolean> {
        const email = getEmail(qrCode);

        return this.checkUserExist(qrCode).pipe(
            switchMap(exist =>
                exist ? this.signIn(email).pipe(map(() => true)) : this.signUpQr(qrCode, email).pipe(map(() => false)),
            ),
        );
    }

    getProductGroups(): Observable<ProductGroupMeta[]> {
        const key = `current-user`;
        const cache = this.cache.get(key);

        if (cache) {
            return of(cache);
        }

        return this.fromSupabase(
            this.supabase.from('product_group').select('*, product (id, title)').order('order'),
        ).pipe(
            switchMap(res =>
                !res.data?.length ? throwError(() => SupabaseErrors.GetProductGroupsError) : of(res.data),
            ),
            tap(res => this.cache.set(key, res)),
        );
    }

    getUserByQr(id: number): Observable<UserMeta> {
        return this.fromSupabase(this.supabase.from('user_meta').select('*').eq('qr_code', id).single()).pipe(
            switchMap(res => (!res.data ? throwError(() => SupabaseErrors.QrNotFound) : of(res.data))),
        );
    }

    getCurrentUser(): Observable<UserMeta> {
        const key = `current-user`;
        const cache = this.cache.get(key);

        if (cache) {
            return of(cache);
        }

        return this.fromSupabase(
            this.supabase.from('user_meta').select('*').eq('user_id', this.session?.user.id).single(),
        ).pipe(
            switchMap(res => (!res.data ? throwError(() => SupabaseErrors.GetCurrentUserError) : of(res.data))),
            tap(res => this.cache.set(key, res)),
        );
    }

    getStands(): Observable<StandMeta[]> {
        const key = `stands`;
        const cache = this.cache.get(key);

        if (cache) {
            return of(cache);
        }

        return this.fromSupabase(this.supabase.from('stand').select('*').order('id', {ascending: true})).pipe(
            switchMap(res => (!res.data ? throwError(() => SupabaseErrors.GetStandsMetaError) : of(res.data))),
            tap(res => this.cache.set(key, res)),
        );
    }

    getProduct(id: number): Observable<ProductMeta> {
        const key = `product_${id}`;
        const cache = this.cache.get(key);

        if (cache) {
            return of(cache);
        }

        return this.fromSupabase(this.supabase.from('product').select('*').eq('id', id).single()).pipe(
            switchMap(({data}) => (!data ? throwError(() => SupabaseErrors.GetProductError) : of(data))),
            tap(res => this.cache.set(key, res)),
        );
    }

    getProductsByStand(stand_id: number): Observable<ProductMeta[]> {
        const key = `products_by_stand_${stand_id}`;
        const cache = this.cache.get(key);

        if (cache) {
            return of(cache);
        }

        return this.fromSupabase(
            this.supabase.from('product').select('*').order('order').eq('stand_id', stand_id),
        ).pipe(
            switchMap(({data}) => (!data ? throwError(() => SupabaseErrors.GetProductError) : of(data))),
            tap(res => this.cache.set(key, res)),
        );
    }

    // TODO
    requestPresentation(id: number, email: string): Observable<unknown> {
        return from(
            this.supabase
                .from('user_presentation')
                .insert({presentation_id: id, email, user_id: this.session!.user.id}),
        );
    }

    // TODO
    checkPresentation(id: number, type: 'stand' | 'product'): Observable<boolean> {
        return of(false);
        // const getFilter = () => {}
        //
        // return this.getSession().pipe(
        //     switchMap(res => {
        //         if (!res?.user.id) {
        //             return of(false);
        //         }
        //         return this.fromSupabase(
        //             this.supabase
        //                 .from(`user_presentation_${type}`)
        //                 .select('*')
        //                 .match({user_id: res.user.id, presentation_id: id}),
        //         ).pipe(map(({data}) => !!data?.length));
        //     }),
        // );
    }

    getStandsStats(): Observable<CardInfo[]> {
        return from(this.supabase.from('user_stand').select('*').eq('user_id', this.session!.user.id)).pipe(
            map(res => res?.data ?? []),
        );
    }

    setStandDone(cardId: number, user_id = this.session!.user.id, comment?: string): Observable<unknown> {
        return this.fromSupabase(this.supabase.from('user_stand').insert({stand_id: cardId, user_id, comment})).pipe(
            switchMap(res => (!!res.error ? throwError(() => SupabaseErrors.SetStandDoneError) : of(res))),
        );
    }

    getSession(skipWrite = false) {
        return from(this.supabase.auth.getSession()).pipe(
            map(res => res.data.session),
            tap(res => !skipWrite && (this.session = res)),
        );
    }

    private getUsedQrs(): Observable<number[]> {
        return this.fromSupabase(this.supabase.from('user_meta').select('qr_code')).pipe(
            switchMap(res => {
                if (!!res.error) {
                    return throwError(() => SupabaseErrors.GetQrsError);
                }

                return of(res.data?.map(({qr_code}) => qr_code) ?? []);
            }),
        );
    }

    private signUpQr(qrCode: number, email: string) {
        let meta = {} as UserMeta;

        return this.getServiceMeta(qrCode).pipe(
            tap(serviceMeta => {
                delete serviceMeta.id;
                meta = serviceMeta;
            }),
            switchMap(() => this.signUp(email)),
            map(user_id => ({...meta, user_id, phone_number: clearPhoneNumber(meta.phone_number)})),
            switchMap(res => this.postUserMeta(res)),
            switchMap(res => this.signIn(email)),
            map(() => qrCode),
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

    private getServiceMeta(qrCode: number): Observable<UserMeta> {
        return this.fromSupabase(this.supabase.from('service_meta').select('*').eq('qr_code', qrCode).single()).pipe(
            switchMap(({data}) => {
                if (!data) {
                    return throwError(() => SupabaseErrors.QrNotFound);
                }

                delete data.id;

                return of(data);
            }),
        );
    }

    private checkUserExist(qrCode: number): Observable<boolean> {
        return this.fromSupabase(this.supabase.from('user_meta').select(`user_id`).eq('qr_code', qrCode).single()).pipe(
            map(({data}) => !!data?.user_id),
        );
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

    private getAllProfiles() {
        return from(this.supabase.from('user_meta').select(`*`));
    }
}

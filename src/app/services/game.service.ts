import {inject, Injectable} from '@angular/core';
import {SupabaseService} from './supabase.service';
import {catchError, map, Observable, of} from 'rxjs';
import {CardMeta} from '@terralink-demo/models';
import {CARDS} from '../domain/cards.const';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private readonly supabaseService = inject(SupabaseService);

    getCards(): Observable<CardMeta[]> {
        return this.supabaseService
            .getCardsInfo()
            .pipe(catchError(() => of([])))
            .pipe(map(res => CARDS.map(c => ({...c, done: res.some(r => r.stand_id === c.id)}))));
    }

    setDone(cardId: number): Observable<unknown> {
        return this.supabaseService.setCardDone(cardId);
    }
}

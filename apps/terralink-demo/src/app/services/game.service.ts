import {inject, Injectable, signal} from '@angular/core';
import {SupabaseService} from './supabase.service';
import {catchError, forkJoin, map, Observable, of} from 'rxjs';
import {StandMeta} from '@terralink-demo/models';

@Injectable({
    providedIn: 'root',
})
export class GameService {
    private readonly supabaseService = inject(SupabaseService);
    readonly forcePlayMusic = signal(true, {
        equal: () => false,
    });

    getCards(): Observable<StandMeta[]> {
        return forkJoin([
            this.supabaseService.getStandsStats().pipe(catchError(() => of([]))),
            this.supabaseService.getStands(),
        ]).pipe(map(([stats, cards]) => cards.map(c => ({...c, done: stats.some(r => r.stand_id === c.id)}))));
    }

    setDone(cardId: number): Observable<unknown> {
        return this.supabaseService.setStandDone(cardId);
    }

    donePlaySound(): void {
        const audio = new Audio();
        audio.src = 'assets/sounds/success.mp3';
        audio.currentTime = 0;
        audio.play().then();
    }
}

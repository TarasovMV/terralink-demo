import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiAlertService, TuiExpandModule} from '@taiga-ui/core';
import {SvgIconComponent} from 'angular-svg-icon';
import {ActivatedRoute, Router} from '@angular/router';
import {Pages, ProductGroupMeta} from '@terralink-demo/models';
import {SupabaseService} from '../../services/supabase.service';
import {finalize, takeUntil} from 'rxjs';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {LoaderService} from '../../services/loader.service';

@Component({
    selector: 'knowledge-page',
    standalone: true,
    imports: [CommonModule, TuiExpandModule, SvgIconComponent],
    templateUrl: './knowledge-page.component.html',
    styleUrl: './knowledge-page.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KnowledgePageComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly previousProduct = inject(ActivatedRoute).snapshot.queryParamMap.get('id');
    private readonly destroy$ = inject(TuiDestroyService);
    private readonly alertService = inject(TuiAlertService);
    private readonly supabaseService = inject(SupabaseService);
    private readonly showLoader = inject(LoaderService).showLoader;

    readonly groups = signal<ProductGroupMeta[]>([]);
    readonly expandedMap = new Map<ProductGroupMeta, boolean>();

    ngOnInit() {
        console.log(this.previousProduct);

        this.showLoader.set(true);
        this.supabaseService
            .getProductGroups()
            .pipe(
                finalize(() => this.showLoader.set(false)),
                takeUntil(this.destroy$),
            )
            .subscribe({
                next: groups => {
                    console.log(groups);

                    const expandedGroup = this.previousProduct
                        ? groups.find(g => g.product.map(p => p.id).includes(+this.previousProduct!)) ?? groups[0]
                        : groups[0];

                    if (!groups.length) {
                        return;
                    }

                    this.groups.set(groups);
                    this.expandedMap.set(expandedGroup, true);
                },
                error: () => {
                    this.alertService
                        .open('Произошла ошибка при загрузке продуктов', {status: 'error'})
                        .pipe(takeUntil(this.destroy$))
                        .subscribe();
                },
            });
    }

    expand(item: ProductGroupMeta): void {
        this.expandedMap.clear();
        this.expandedMap.set(item, !this.expandedMap.get(item));
    }

    goToProduct(productId: number): void {
        this.router.navigate([Pages.ProductPresentation, productId]);
    }
}

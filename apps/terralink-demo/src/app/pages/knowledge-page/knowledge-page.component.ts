import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiAlertService, TuiExpandModule} from '@taiga-ui/core';
import {SvgIconComponent} from 'angular-svg-icon';
import {Router} from '@angular/router';
import {Pages, ProductGroupMeta} from '@terralink-demo/models';
import {SupabaseService} from '../../services/supabase.service';
import {finalize, takeUntil} from 'rxjs';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {LoaderService} from '../../services/loader.service';

const KNOWLEDGE_ITEMS = [
    {
        imgPath: 'assets/knowledges/mobile.svg',
        label: 'Мобильная разработка',
        products: [
            {
                label: 'Корпоративный портал',
                id: 1,
            },
            {
                label: 'Мобильное ТОРО',
                id: 1,
            },
            {
                label: 'Длинное название какого-то продукта в разделе',
                id: 1,
            },
        ],
    },
    {
        imgPath: 'assets/knowledges/ai.svg',
        label: 'Искусственный интеллект',
        products: [
            {
                label: 'Продукт 1',
                id: 1,
            },
        ],
    },
    {
        imgPath: 'assets/knowledges/big-data.svg',
        label: 'Большие данные',
        products: [
            {
                label: 'Продукт 1',
                id: 1,
            },
        ],
    },
] as {
    imgPath: string;
    label: string;
    products: {label: string; id: number}[];
}[];

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
    private readonly destroy$ = inject(TuiDestroyService);
    private readonly alertService = inject(TuiAlertService);
    private readonly supabaseService = inject(SupabaseService);
    private readonly showLoader = inject(LoaderService).showLoader;

    readonly groups = signal<ProductGroupMeta[]>([]);
    readonly items = KNOWLEDGE_ITEMS;
    readonly expandedMap = new Map<ProductGroupMeta, boolean>();

    ngOnInit() {
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

                    if (!groups.length) {
                        return;
                    }

                    this.groups.set(groups);
                    this.expandedMap.set(groups[0], true);
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

import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TuiExpandModule} from '@taiga-ui/core';
import {SvgIconComponent} from 'angular-svg-icon';
import {Router} from '@angular/router';
import {Pages} from '@terralink-demo/models';

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
export class KnowledgePageComponent {
    private readonly router = inject(Router);

    readonly items = KNOWLEDGE_ITEMS;
    readonly expandedMap = new Map<(typeof KNOWLEDGE_ITEMS)[0], boolean>([[KNOWLEDGE_ITEMS[0], true]]);

    expand(item: (typeof KNOWLEDGE_ITEMS)[0]): void {
        this.expandedMap.clear();
        this.expandedMap.set(item, !this.expandedMap.get(item));
    }

    goToProduct(productId: number): void {
        this.router.navigate([Pages.ProductPresentation, productId]);
    }
}

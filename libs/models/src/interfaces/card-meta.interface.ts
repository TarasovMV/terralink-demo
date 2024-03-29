import {ProductMeta} from './product-meta.interface';

export interface StandMeta {
    id: number;
    title: string;
    body: string;
    description: string;
    image_path: string;
    done?: boolean;
}

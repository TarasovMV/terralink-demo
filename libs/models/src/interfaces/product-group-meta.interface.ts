export interface ProductGroupMeta {
    id: number;
    title: string;
    image_path: string;
    order: number;
    product: {id: number; title: string}[];
}

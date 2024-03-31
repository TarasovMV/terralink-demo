export interface UserMeta {
    id?: string;
    user_id?: string;
    fullname: string;
    email: string;
    created_at: string;
    phone_number?: string;
    music_genre?: string | null;
    organization?: string | null;
    position?: string | null;
    qr_code?: number | null;
}

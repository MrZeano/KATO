export type UserRole = 'user' | 'admin';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    email_verified_at?: string;
    created_at?: string;
}

export type PostStatus = 'pending' | 'approved' | 'rejected';

export interface Post {
    id: number;
    user_id: number;
    user?: User;
    title: string;
    image_path: string;
    thumbnail_path: string;
    prompt: string;
    negative_prompt?: string | null;
    ai_model: string;
    seed?: string | null;
    cfg_scale?: number | null;
    steps?: number | null;
    sampler?: string | null;
    status: PostStatus;
    rejection_reason?: string | null;
    created_at: string;
    updated_at: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};

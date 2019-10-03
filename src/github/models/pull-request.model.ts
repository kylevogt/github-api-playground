export interface PullRequest {
    id: number;
    number: number;
    state: string;
    title: string;
    user: any;
    created_at: string;
    updated_at: string;
    closed_at: string;
    merged_at: string;
}

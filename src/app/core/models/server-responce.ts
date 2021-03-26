export interface ServerResponce<T> {
    count: number;
    next: string;
    previous: string;
    results: T;
}

export interface ServerResponce<T> {
    count: number;
    next: string;
    previous: string;
    results: T;
}
export interface FilterResponce<T>{
    all_count: 0
    products: T
    red_count: 0
    white_count: 0
}
import { TranslationItem } from './translate';

interface ExecutorFinancesDetailsSubCategory {
    count: number;
    subcategory_id: number;
    subcategory_name: TranslationItem[];
}
export interface ExecutorFinancesDetails {
    all_count: number;
    e_payment: number;
    e_payment_money: number;
    payed_by_cache_count: number;
    payed_by_cache_money: number;
    subcategories: ExecutorFinancesDetailsSubCategory[];
}

export interface FinancesDebetList {
    debet: number;
    first_name: string;
    last_name: string;
    user_id: number;
    type: 'client' | 'executor';
}

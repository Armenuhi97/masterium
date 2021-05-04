import { TranslationItem } from './translate';

export interface Measurment {
    measurement_type: {
        id: number,
        code: string,
        translation_key: string
    };
    id?: number,
    code?: string,
    name_en:string
    name_ru:string
    name_ge:string
    title: TranslationItem[];
}

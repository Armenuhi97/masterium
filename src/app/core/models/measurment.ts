import { TranslationItem } from './translate';

export interface Measurment {
    measurement_type: {
        id: number,
        code: string,
        translation_key: string
    };
    title: TranslationItem[];
}

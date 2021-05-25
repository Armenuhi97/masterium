export interface Language {
  code: string;
  icon: string;
  id: number;
  translation_key: string;
}

export interface TranslationItem {
  name_en?: string
  name_ge?: string
  name_ru?: string
  id?: number;
  key?: string;
  value?: string;
  language?: number;
  code?:string
}

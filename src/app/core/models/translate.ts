export interface Language {
  code: string;
  icon: string;
  id: number;
  translation_key: string;
}

export interface TranslationItem {
  id?: number;
  key?: string;
  value?: string;
  language?: number;
}

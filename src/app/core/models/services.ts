import { Measurment } from './measurment';
import { Language, TranslationItem } from './translate';

export interface CategoryDetail {
  color: string;
  icon: string;
  id?: number;
  translation_key?: string;
  translation_key_description?: string;
}

export interface Category {
  id?: number;
  category?: CategoryDetail;
  color?: string;
  icon?: string;
  translation_key?: string;
  translation_key_description?: string;
  name_en?: string,
  name_ge?: string,
  name_ru?: string,
  description_en?: string,
  description_ge?: string,
  description_ru?: string,
  title?: TranslationItem[];
  description?: TranslationItem[];
  specialists_count?: number;
  workload_percent?: number;
}

export interface SubcategoryDetails {
  icon?: string;
  id?: number;
  only_for_product?: boolean;
  category?: Category;
  translation_key_title?: string;
  is_popular: boolean;
  name_en?: string
  name_ge?: string
  name_ru?: string
}

export interface Subcategory {
  title: TranslationItem[];
  subcategory?: SubcategoryDetails;
  icon?: string;
  id?: number;
  only_for_product?: boolean;
  translation_key_title?: string;
  is_popular?: boolean;
  category?: any;
  name_en: string,
  name_ge: string,
  name_ru: string
}

export interface SubcategoryRequest {
  // subcategory?: {
  //   is_popular?: boolean;
  //   translation_key_title?: string;
  //   icon?: string;
  //   only_for_product?: number
  //   category?: number;
  // };
  is_popular?: boolean;
  icon?: string;
  only_for_product?: number
  category?: number;
  name_en?: string;
  name_ru?: string,
  name_ge?: string
  title?: TranslationItem[];
}

export interface ServiceDescription {
  id: 186;
  language: Language;
  key: string;
  value: string;
}

export interface ServiceResponse {
  id?: number,
  service: {
    id: number,
    measurement_type: {
      id: number,
      code: string,
      translation_key: string
    }
    subcategory: {
      id: 12,
      category: CategoryDetail,
      icon: string,
      translation_key_title: string
      only_for_product: boolean
    },
    icon: string,
    price: number,
    translation_key_title: string,
    translation_key_description: string,
    guarantee_day_count: number
  };
  title?: TranslationItem[];
  description?: ServiceDescription[];
  name_en: string,
  name_ge: string,
  name_ru: string,
  description_en: string
  description_ru: string
  description_ge: string
  icon: string
}

export interface ServiceRequest {
  service: {
    price?: number,
    measurement_type?: number,
    guarantee_day_count?: number,
    translation_key_title: string,
    translation_key_description: string,
    icon?: string,
    subcategory: number
  };
  title?: TranslationItem[];
  description?: TranslationItem[];
  name_en: string,
  name_ge: string,
  name_ru: string,
  description_en:string,
  description_ge: string,
  description_ru: string
}

export interface SubserviceResponse {
  // subservice: {
  id: number,
  measurement_type: {
    id: number,
    code: string,
    // translation_key: string,
    name_en: string,
    name_ge: string,
    name_ru: string
  },
  service: {
    id: number,
    subcategory: SubcategoryDetails
    // translation_key_title: string;
    // translation_key_description: string;
    name_en: string,
    name_ge: string,
    name_ru: string
  },
  subservice_type: {
    id: number;
    // translation_key: string;
    name_en: string,
    name_ge: string,
    name_ru: string
  },
  price: number;
  guarantee_day_count: number;
  // };
  // title: TranslationItem[];
}

export interface Subservice {
  service?: number;
  subservice_type: number;
  price: number;
  measurement_type: number;
  guarantee_day_count: number;
}

export interface SubserviceRequest {
  service_id?: number;
  subservices: Subservice[];
}

export interface SubserviceType {
  subservice_type?: {
    id: number;
    translation_key: string;
  };
  id?: number;
  translation_key?: string;
  title?: TranslationItem[];
  name_en?: string;
  name_ru?: string;
  name_ge?: string;
}

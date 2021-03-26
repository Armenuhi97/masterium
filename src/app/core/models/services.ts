import { Measurment } from './measurment';
import { Language, TranslationItem } from './translate';

export interface CategoryDetail {
  color_one: string;
  color_two: string;
  gradient_degree: number;
  icon: string;
  id?: number;
  translation_key: string;
  translation_key_description: string;

}

export interface Category {
  id?: number;
  category: CategoryDetail;
  title: TranslationItem[];
  description: TranslationItem[];
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
}

export interface Subcategory {
  title: TranslationItem[];
  subcategory: SubcategoryDetails;
  category?: any;
}

export interface SubcategoryRequest {
  subcategory: {
    is_popular?: boolean;
    translation_key_title?: string;
    icon?: string;
    only_for_product?: number
    category?: number;
  };
  title: TranslationItem[];
}

export interface ServiceDescription {
  id: 186;
  language: Language;
  key: string;
  value: string;
}

export interface ServiceResponse {
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
  title: TranslationItem[];
  description: ServiceDescription[];
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
  title: TranslationItem[];
  description: TranslationItem[];
}


export interface SubserviceResponse {
  subservice: {
    id: number,
    measurement_type: {
      id: number,
      code: string,
      translation_key: string,
    },
    service: {
      id: 9,
      subcategory: SubcategoryDetails
      translation_key_title: string;
      translation_key_description: string;
    },
    subservice_type: {
      id: number;
      translation_key: string;
    },
    price: number;
    guarantee_day_count: number;
  };
  title: TranslationItem[];
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
  subservice_type: {
    id: number;
    translation_key: string;
  };
  title: TranslationItem[];
}

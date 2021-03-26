import {TranslationItem} from './translate';

export interface Specialization {
    id?: number;
    url?: string;
    title?: string;
    icon?: string;
}

export interface SubService {
    id?: number;
    url?: string;
    title: string;
    icon: string;
    service: string;
}

export interface Service {
    id?: number;
    url?: string;
    title?: string;
    icon?: string;
    specialistsCount?: number;
    workload?: number;
}

export interface EssenceItem {
  title: TranslationItem[];
  help?: {
    id?: number;
    translation_key_title: string;
    translation_key_description: string;
  };
  measurement_type?: {
    id?: number;
    code?: string;
    translation_key: string;
  };
  specialization?: {
    id?: number;
    icon?: string;
    translation_key: string;
  };
  subservice_type?: {
    id?: number;
    translation_key: string;
  };
  user_attachment_type?: {
    id?: number;
    translation_key: string;
  };
  description?: TranslationItem[];
}
export interface Address {
  id: number;
  address: string;
  longitude: string;
  latitude: string;
  is_primary: boolean;
  user: number;
}

export interface AutocompleteItem {
  id: number;
  label: string;
  real_price: number;
  current_price: number;
  quantity: number;
}

import { TranslationItem } from './translate';

export interface DisputList {
  customer_name: string;
  description: string;
  disput_images: { id: number, image_url: string }[];
  executr_name: string;
  id: number;
  order_id: number;
  created_at: string;
  order_number: string;
  status: TranslationItem[];
}

export interface Disput {
  customer_name: string;
  description: string;
  disput_images: { id: number, image_url: string }[];
  executr_name: string;
  id: number;
  order_id: number;
  created_at: string;
  order_number: string;
  status: TranslationItem[];
}

export interface DisputStatus {
  disput_status: {
    code: string;
    id: number;
    translation_key: string;
  };
  title: TranslationItem[];
}


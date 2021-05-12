import { Measurment } from './measurment';
import { SubcategoryDetails } from './services';
import { TranslationItem } from './translate';
import { User } from './user';
export interface MarketsProductResponce {
  all_count: number,
  products: MarketsProduct[],
  red_count: number,
  white_count: number
}
export interface MarketsProduct {
  id: number;
  subcategory: SubcategoryDetails;
  price: number;
  show_in_market: boolean;
  minimal_count: number;
  product_code?: string;
  translation_key_name: string;
  translation_key_description: string;
  measurement: Measurment;
  product_category_id: number;
  product_subcategory: number;
  vat?: string;
  cost_price?: number;
  guarantee_day_count: number
  name_en: string;
  name_ru: string;
  name_ge: string,
  description_en: string;
  description_ru: string;
  description_ge: string
  quantity?: number;
  title: TranslationItem[];
  description: TranslationItem[];
  images: MarketProductImage[];

  // discounted_price: number
}


export interface MarketProduct {
  all_count: number
  red_count: number
  white_count: number
  products: MarketProductItem[]

}
export interface MarketProductItem {
  id: number;
  subcategory: SubcategoryDetails;
  price: number;
  show_in_market: boolean;
  minimal_count: number;
  product_code?: string;
  translation_key_name: string;
  translation_key_description: string;
  measurement: any;
  product_category_id: number;
  product_subcategory: number;
  vat?: string;
  cost_price?: number;
  minimal_count_for_board
  minimum_count_for_order
  maximum_count_for_order
  quantity?: number;
  title?: TranslationItem[];
  description?: TranslationItem[];
  name_en?: string,
  name_ru?: string,
  name_ge?: string,
  description_en?: string,
  description_ru?: string,
  description_ge?: string
  images: MarketProductImage[];

}
export interface MarketProductRequest {
  // product: {
  guarantee_day_count?: number
  id: number;
  price: number;
  measurement: number;
  quantity?: number;
  minimal_count?: number;
  product_code?: string;
  minimal_count_for_board?: number;
  minimum_count_for_order?: number;
  maximum_count_for_order?: number;
  translation_key_name?: string;
  translation_key_description?: string;
  product_subcategory: number,
  show_in_market?: boolean | number
  vat?: string;
  cost_price?: number;

  name?: TranslationItem[];
  description?: TranslationItem[];
  image: MarketProductRequestImage[];
  name_en?: string,
  name_ru?: string,
  name_ge?: string,
  description_en?: string,
  description_ru?: string,
  description_ge?: string
  // };
}
export interface WarehouseRequest {
  product: {
    id: number;
    minimal_count?: number;
    minimal_count_for_board?: number;
    minimum_count_for_order?: number;
    maximum_count_for_order?: number;
  };
}
export interface MarketProductImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  product: number;
}

export interface MarketProductRequestImage {
  image_url: string;
  is_primary: boolean;
}

export interface MarketProductGalleryResponse {
  url: string;
  id: number;
  imageUrl: {
    urlstring
    id: number,
    image: string
  };
  marketProduct: string;
  image: string;

}

export interface Transaction {
  date: string;
  id: number;
  order: any;
  product: number;
  quantity: number;
  user: User;
}

export interface AddProductToExecutorRequest {
  quantity: number;
}

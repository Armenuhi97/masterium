import {SubcategoryDetails} from './services';

export interface Promotion {
  // id?: number;
    start_date: string,
    end_date: string,
    id?: number;
    name?: string;
  discount: Discount[];
  product_subcategory: Discount[];
}

export interface PromotionRequestObject {
  id?: number;
  sale: {
    start_date: string,
    end_date: string,
    id?: number;
    name?: string;
  };
  discount: Discount[];
  product_subcategory: Discount[];
}
export interface Discount {
  percent: number;
  subcategory: any;
  sale?: number;
  id?: number;
  product_subcategory?: any;
}

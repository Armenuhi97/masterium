import { ClientList, User } from './user';
import { Address } from './utils';
import { TranslationItem } from './translate';
import { SubcategoryDetails } from './services';

interface DescriptionImage {
  id: number;
  image_url: string;
  order: number;
}

interface Suborder {
  suborder: {
    current_price: number;
    description_image: number[];
    done_at: string;
    id: number;
    order: number;
    real_price: number;
    start_date: string;
    status: TranslationItem;
    suborder_name: number;
    subservice: any;
    comment?: string;
    guarantee_period: number;
  };
  suborder_real_price: number;
  disput: [];
  suborder_current_price: number;
  status: TranslationItem[];
  status_name:TranslationItem[]
  products: [];
  executor: any[];
  subservice: [];
}

export interface Order {
  id: number;
  address: number;
  user: {
    user_id: number;
    user_name: string;
    phone_number: string;
  };
  order_number: string;
  created_at: string;
  start_date: string;
  payed_by_cache: boolean;
  description: string;
  status: TranslationItem[];
  disput_count: number;
  ordered_product_count: number;
  ordered_subservice_count: number;
  suborders_count: number;
  user_address: number;
}

export interface OrderDetail {
  order: {
    id: number;
    address: Address;
    user: ClientList;
    order_number: string;
    created_at: string;
    start_date: string;
    payed_by_cache: boolean;
    description: string;
    status: number;
  };
  order_price: number;
  status: { status_code: string; status_name: TranslationItem[] };
  description_image: DescriptionImage[];
  suborder: Suborder[];
  product: [];
  subservices: [];
}

export interface OrderSubgroupDragItem {
  id: string;
  name: string;
  groupItemList: any[];
  status?: string;
  suborderMain?: {
    debet?: number;
    current_price: number;
    description_image: number[];
    done_at: string;
    id: number;
    order: number;
    real_price: number;
    start_date: string;
    status: TranslationItem;
    suborder_name: number;
    subservice: any;
    payed?: boolean;
    comment?: string;
    guarantee_period: number;
  };
  isEditing: boolean;
  suborder?: any;
  executors?: SuborderExecutor[];
  disput?: []
}

export enum DragItemTypes {
  Service = 'service',
  Product = 'product',
  Picture = 'picture',
}

export interface AutocompleteOptionGroups {
  id: number;
  title: string;
  price?: number;
  discountPrice?: number;
  children?: AutocompleteOptionGroups[];
}

export interface SuborderService {
  subservice_id: number;
  real_price: number;
  current_price: number;
}

export interface SuborderExecutor {
  id?: number;
  executor_id: number;
  is_overman: boolean;
  user?: any;
}

export interface SuborderProduct {
  product_id: number;
  quantity: number;
  real_price: number;
  current_price: number;
}

export interface SuborderDescriptionImage {
  id: number;
}

export interface RemovedOrder {
  id: number;
}

export interface SuborderItem {
  suborder: {
    start_date: string;
    suborder_name: string;
    suborder_id: number;
    products_price: number;
    services_price: number;
    guarantee_period: number;
    comment: string;
  };
  order_subservices: SuborderService[];
  executor: SuborderExecutor[];
  product: SuborderProduct[];
  description_image: SuborderDescriptionImage[];
}

export interface OrderRequest {
  order_id: number;
  removed_suborders: RemovedOrder[];
  suborders: SuborderItem[];
}

export interface ExecutorsResponse {
  count: number;
  next: string;
  previous: string;
  results: User[];
}

export interface OrderStatus {
  order_status: {
    id: number;
    code: string;
    translation_key: string;
  };
  title: TranslationItem[];
}

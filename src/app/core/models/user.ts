import { Order } from './order';
import { Subservice } from './services';
import { TranslationItem } from './translate';

interface ExecutorCategory {
  id: number;
}

interface UserSpecialization {
  specialization_id: number;
  is_prioritized: boolean;
}

interface UserAttachment {
  attachment_type_id: number;
  file_url: string;
}

export interface User {
  user: {
    user: number;
    user_role: {
      id: number;
      title: string;
      code: string;
    };
    categories: any[];
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    image: string;
    company_name: string;
    company_type: any;
    company_id: number;
    city: any;
    about: string;
    experience: string;
    study_history: string;
    credit_card_number: string;
    is_cooperative_user: boolean;
    is_blocked: boolean;
    is_active: boolean;
  };
  tarif: number;
  start_time: string;
  end_time: string;
  id?: number;
}

export interface ExecutorRequest {
  user_details: {
    first_name: string;
    last_name: string;
    phone_number: string;
    about: string;
    experience: string;
    study_history: string;
    credit_card_number: string;
    is_registered_executor: number;
    email: string;
    image: string;
    city: string;
  };
  user_schedule: {
    tarif: number;
    start_time: string;
    end_time: string;
  };
  subcategories: ExecutorCategory[];
  user_specializations: UserSpecialization[];
  user_attachments: UserAttachment[];
}

export interface UserDetail {
  user_details: {
    user: number;
    user_role: {
      id: number;
      title: string;
      code: string;
    };
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    image: string;
    company_name: string;
    company_type: any;
    company_id: number;
    city: any;
    about: string;
    experience: string;
    study_history: string;
    credit_card_number: string;
    is_cooperative_user: boolean;
    is_blocked: boolean;
    is_active: boolean;
    is_registered_executor: true;
  };
  user_attachments: any;
  user_specialization: any;
  user_schedule: any;
  user_subcategory: any;
}

export interface ClientDetail {
  user_details: {
    user: number;
    user_role: {
      id: number;
      title: string;
      code: string;
    };
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    image: string;
    company_name: string;
    company_type: any;
    company_id: number;
    city: any;
    about: string;
    experience: string;
    study_history: string;
    credit_card_number: string;
    is_cooperative_user: boolean;
    is_blocked: boolean;
    is_active: boolean;
    is_registered_executor: true;
  };
}

export interface ClientRequest {
  first_name: string;
  last_name: string;
  phone_number: string;
  company_name: string;
  company_type_id: string;
  company_id: string;
  about: string;
  experience: string;
  study_history: string;
  credit_card_number: string;
  is_cooperative_user: number;
  email: string;
  image: string;
}

export interface ClientList {
  user: number;
  user_role: {
    id: number;
    title: string;
    code: string;
  };
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  image: string;
  company_name: string;
  company_type: any;
  company_id: number;
  city: any;
  about: string;
  experience: string;
  study_history: string;
  credit_card_number: string;
  is_cooperative_user: boolean;
  is_blocked: boolean;
  is_active: boolean;
  is_registered_executor: true;
}

// export interface ExecutorOrderHistoryRequest {
//   start_index: number,
//   status_id: number
// }
export interface ClientOrderHistoryResponse {
  date: string;
  description: string;
  guarantee_date: string;
  image: null;
  is_active: true;
  order_id: null;
  order_number: string;
  price: number;
  status: Array<{ value: string }>;
  status_key: string;
  suborder_id: number;
}
export interface ClientDisputHistoryResponse {
  date: string;
  description: string;
  guarantee_date: string;
  image: null;
  is_active: true;
  order_id: null;
  order_number: string;
  price: number;
  status: Array<{ value: string }>;
  status_key: string;
  suborder_id: number;
}
export interface ExecutorOrderHistoryResponse {
  description_image: any;
  done_at: string;
  id: number;
  order: Order;
  price: number;
  products_price: number;
  services_price: number;
  start_date: string;
  status: number;
  suborder_disput: [];
  suborder_name: string;
  subservice: Subservice[];
}
export interface ExecutorBoard {
  id: number;
  product: {
    id: number,
    name: Array<{ value: string }>
    price: number
    product_images: Array<{
      id: number
      image_url: string
      is_primary: number
    }>
  };
  quantity: number;
}
export interface BoardResponce {
  name: string;
  price: number;
  image: Array<{
    image_url: string
    is_primary: boolean
  }>;
  quantity?: number;
}
export interface RewardByPeriodRequest {
  userId: number;
  startDate: string;
  endDate: string;
}

export interface ExecutorFineRequest {
  user_id: number;
  point: number;
  text: string;
}

export interface ExecutorSalaryRequest {
  user_id: number;
  point: number;
  comment: string;
}

export interface ExecutorDeal {
  created_at: string;
  created_by: User;
  id: number;
  point: number;
  text: string;
  user: number;
}

export interface ExecutorSumResponse {
  executor_details?: ClientList;
  penalty: ExecutorDeal[];
  penalty_sum: number;
  salary: ExecutorDeal[];
  suborder_sum_by_tarif: number;
  suborders: [];
  suborders_sum: number;
  tarif: number;
  total_sum: number;
}

export interface CompanyType {
  company_type: {
    id: number;
    translation_key: string;
  };
  title: TranslationItem[];
}

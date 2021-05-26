export interface LoginResponce {
    token: string;
    user: UserItem
}
export interface UserItem {
    about: string
    auth_id: string
    auth_provider: string
    bank: string
    city: string
    company_id: string
    company_name: string
    company_type: string
    credit_card_number: string
    email: string
    experience: string
    first_name: string
    image: string
    is_active: boolean
    is_blocked: boolean
    is_cooperative_user: boolean
    is_pro: boolean
    is_registered_executor: boolean
    last_name: string
    phone_number: string
    study_history: null
    user: number
    user_role: { id: number, title: string, code: string }
    working_area: string
}
export interface MessageRequest {
    room: number;
    message: string;
    sender: number;
    file_url: string;
    replier_is_admin: boolean;
    file_type:string
}

export interface Message {
    created_at: string;
    file_url: string;
    id: number;
    is_seen: boolean;
    replier_is_admin: boolean;
    room: number;
    text: string;
    sender: {
        user: {
            first_name: string;
            image: string;
            last_name: string;
        }
    };
}

export interface RoomMember {
    id: number;
    user: {
        first_name: string;
        image: string;
        last_name: string;
        user_id: number;
        user_role: {
            code: string;
            id: number;
            title: string;
        }
    };
}

export interface RoomList {
    unseen_message_count: number;
    room: {
        created_at: string;
        id: number;
        room_members: RoomMember[];
        last_message: string;
        with_admin: boolean;
    }
}

export interface CreateRoomResponse {
    created_at: string;
    id: number;
    with_admin: boolean;
}

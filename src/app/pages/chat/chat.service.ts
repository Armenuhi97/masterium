import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client/build/index';
import { Message, MessageRequest, RoomList } from 'src/app/core/models/chat';
import { environment } from 'src/environments/environment';

@Injectable()
export class ChatService {
    private _socket;

    constructor(private _httpClient:HttpClient,private _cookieService:CookieService) { }

    public connect(token: string): void {
        this._socket = io(environment.SOCKET_ENDPOINT, {
            extraHeaders: {
                Authorization: token
            },
        });
    }

    // EMITTERS
    public sendMessage(message: MessageRequest): void {
        this._socket.emit('send_message_to_room', message);
    }

    public getRooms(): void {
        this._socket.emit('get_rooms');
    }

    public getRoomMessages(id: number,index): void {
        this._socket.emit('get_room_messages', {
            room_id: id,
            user_id:this._cookieService.get('userId'),
            start_index: index
        });
    }

    // HANDLERS
    public socketConnected(): Observable<void> {
        return new Observable(observer => {
            this._socket.on('connect', () => {
                observer.next();
            });
        });
    }

    public onRoomsList(): Observable<RoomList[]> {
        return new Observable(observer => {
            this._socket.on('rooms', (res) => {
                observer.next(res);
            });
        });
    }

    public subscribeToActiveRoomMessages(): Observable<Message[]> {
        return new Observable(observer => {
            this._socket.on('messages', (res) => {
                observer.next(res);
            });
        });
    }

    public subscribeToNewMessages(): Observable<{ message: Message }> {
        return new Observable(observer => {
            this._socket.on('receive', (res) => {
                observer.next(res);
            });
        });
    }
 
}

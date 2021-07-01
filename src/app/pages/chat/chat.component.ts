import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Subject } from 'rxjs';
import { ChatService } from './chat.service';
import { Message, MessageRequest, RoomList } from 'src/app/core/models/chat';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { getBase64 } from 'src/app/core/utilities/base64';
import { MainService } from 'src/app/core/services/main.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  private _isScrollToUp: boolean = false
  windowHeight: number;
  private _unsubscribe$: Subject<void> = new Subject<void>();
  public roomsList: RoomList[];
  public activeRoom: RoomList;
  public messageControl: FormControl = new FormControl('', [Validators.required]);
  public fileControl: FormControl = new FormControl('', [Validators.required]);
  public type: string;
  public name: string
  showImage;
  public messages: Message[] = [];
  private _activeRoomId: number;
  private _lastActtiveRoomId: number
  constructor(
    private _mainService: MainService,
    private _chatService: ChatService,
    private _activatedRoute: ActivatedRoute,
    private _cookieService: CookieService,
    private _loaderService: LoaderService
  ) {
    this.windowHeight = window.innerHeight - 112 - 130;
    this._subscribeToQueryChanges();
  }

  ngOnInit(): void {
    this._chatService.socketConnected().pipe(takeUntil(this._unsubscribe$)).subscribe(() => { });
    this._getRoomsList();
    this._subscribeToActiveRoomMessages();
    this._getNewMessages();
  }

  public userTypeChange(event: string): void { }

  scrollToTop(top) {
    if (!this._isScrollToUp)
      return top
  }
  // SEND MESSAGE
  public sendMessage(): void {
    const message: MessageRequest = {
      room: this.activeRoom.room.id,
      file_url: '',
      file_type: '',
      message: this.messageControl.value,
      replier_is_admin: true,
      sender: 3
    };
    this.messageControl.reset()
    if (this.fileControl.value) {
      this._mainService.uploadFile(this.fileControl.value)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe(res => {
          message.file_url = res.url;
          message.file_type = this.type;
          this._chatService.sendMessage(message);
          this._getNewMessages(false)
        })
    } else {
      this._chatService.sendMessage(message);
      this._getNewMessages(false)

    }
  }

  public setActiveRoom(id: number): void {
    this.messages = []
    this.activeRoom = this.roomsList.find(room => room.room.id === id);
    this.activeRoom.unseen_message_count = 0;
    this._getActiveRoomMessages();
  }

  private _getRoomsList(): void {
    this._loaderService.setHttpProgressStatus(true)
    this._chatService.onRoomsList()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(res => {
        this._loaderService.setHttpProgressStatus(false);
        res.sort((a: any, b: any) => {
          return new Date(b.room.last_message_date).getTime() - new Date(a.room.last_message_date).getTime()
        }
        );
        this.roomsList = res;
        if (this._activeRoomId)
          this.setActiveRoom(+this._activeRoomId)
      });
  }

  private _getNewMessages(ispush: boolean = true): void {
    this._chatService.subscribeToNewMessages()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(res => {
        if (this.activeRoom && res.message.room === this.activeRoom.room.id) {
          if (ispush) {
            this.messages.push(res.message);
            this.messages.sort((a: any, b: any) =>
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          }
          // created_at
          this.activeRoom.room.last_message = res.message.text;
          this.activeRoom.room.last_message_date = res.message.created_at;
          this._sortRoomList()
          this._isScrollToUp = false;
        } else {
          const room = this.roomsList.find(r => r.room.id === res.message.room);
          room.room.last_message = res.message.text;
          room.room.last_message_date = res.message.created_at;
          this._sortRoomList()
          room.unseen_message_count++;
        }
        this.messageControl.reset();
        this.showImage = null;
        this.fileControl.reset();
        this.type = null;
        this.name = null
      });
  }
  private _sortRoomList() {
    this.roomsList.sort((a: any, b: any) =>
      new Date(b.room.last_message_date).getTime() - new Date(a.room.last_message_date).getTime()
    );
  }
  public deleteFile() {
    this.fileControl.reset()
  }
  public handleChange(info: NzUploadChangeParam) {
    this.type = info.file.type;
    this.fileControl.setValue(info.file.originFileObj);

  }
  // ROOM MESSAGES
  private _getActiveRoomMessages(): void {
    this._chatService.getRoomMessages(this.activeRoom.room.id, this.messages.length);
  }
  onScrollUp() {
    this._isScrollToUp = true;
    this._getActiveRoomMessages()
  }
  private _subscribeToActiveRoomMessages(): void {

    this._chatService.subscribeToActiveRoomMessages()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res: any) => {
        if (!this.messages.length) {
          res = res.reverse()
          this.messages = res;
          this._isScrollToUp = false;

          (document.getElementById('scrollMe')).scroll({
            top: document.getElementById('scrollMe').scrollHeight,
            left: 0,
            behavior: 'smooth'
          });
        } else {
          for (let message of res) {
            this.messages.unshift(message);
          }
        }

      });
  }
  private _subscribeToQueryChanges(): void {
    this._activatedRoute.queryParams.subscribe((params) => {
      // const token = String(params.token);
      // if (token) {
      //   this._chatService.connect(token);
      // }
      this._activeRoomId = +params.focusedUserId | +params.focusedRoomId | 0
      // if(params.focusedRoomId){
      //   this.setActiveRoom(+params.focusedRoomId)
      // }
      const token = String(this._cookieService.get('access'));
      if (token) {
        this._chatService.connect(token);
      }
    });

  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }
}

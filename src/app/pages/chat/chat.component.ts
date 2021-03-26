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
    this._subscribeToQueryChanges();
  }

  ngOnInit(): void {
    // this._handleSocketConnected().pipe(takeUntil(this._unsubscribe$)).subscribe(() => { });
    this._getRoomsList();
    this._subscribeToActiveRoomMessages();
    this._getNewMessages();
  }

  public userTypeChange(event: string): void { }

  public async handleChange(image: NzUploadChangeParam): Promise<void> {
    this.name = image.file.name;
    this.type = image.file.type
    this.fileControl.setValue(image.file.originFileObj);
    // tslint:disable-next-line:no-non-null-assertion
    const base64Image = await getBase64(image.file.originFileObj!);
    if (this.type.indexOf('image') > -1) {
      this.showImage = base64Image
    } else {
      this.showImage = null
    }
  }
  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = 480
        // this.myScrollContainer.nativeElement.scrollHeight;
        console.log( this.myScrollContainer.nativeElement.scrollTop);
        console.log(this.myScrollContainer.nativeElement.scrollHeight);
        
        
    } catch(err) { }                 
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
    if (this.fileControl.value) {
      this._mainService.uploadFile(this.fileControl.value)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe(res => {
          message.file_url = res.url;
          message.file_type = this.type;
          this._chatService.sendMessage(message);
        });
    } else {
      this._chatService.sendMessage(message);
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
        this._loaderService.setHttpProgressStatus(false)
        this.roomsList = res;
        if (this._activeRoomId)
          this.setActiveRoom(+this._activeRoomId)
      });
  }

  private _getNewMessages(): void {
    this._chatService.subscribeToNewMessages()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(res => {
        if (res.message.room === this.activeRoom.room.id) {
          this.messages.push(res.message);
        } else {
          const room = this.roomsList.find(r => r.room.id === res.message.room);
          room.room.last_message = res.message.text;
          room.unseen_message_count++;
        }
        this.messageControl.reset();
        this.showImage = null;
        this.fileControl.reset();
        this.type = null;
        this.name = null
      });
  }

  // ROOM MESSAGES
  private _getActiveRoomMessages(): void {
    this._chatService.getRoomMessages(this.activeRoom.room.id, this.messages.length);
  }
  onScrollUp() {
    console.log('scroll');
    this._getActiveRoomMessages()
  }
  private _subscribeToActiveRoomMessages(): void {

    this._chatService.subscribeToActiveRoomMessages()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((res: any) => {
        res = res.reverse()
        if (!this.messages.length) {

          this.messages = res;
          // let element = (document.getElementById('scrollMe'));
          // console.log(element.scrollHeight);

          (document.getElementById('scrollMe')).scroll({
            top: document.getElementById('scrollMe').scrollHeight,
            left: 0,
            behavior: 'smooth'
          });
          // this.scrollToBottom()
        } else {
          for (let message of res) {
            // console.log(message);

            this.messages.unshift(message)
            // console.log(this.messages, 'current');

          }
        }
        // }

      });
  }
  // 0,12,24

  private _subscribeToQueryChanges(): void {
    this._activatedRoute.queryParams.subscribe((params) => {
      // const token = String(params.token);
      // if (token) {
      //   this._chatService.connect(token);
      // }
      this._activeRoomId = +params.focusedUserId | +params.focusedRoomId | 0
      // if(params.focusedRoomId){
      //   console.log(params.focusedRoomId);
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

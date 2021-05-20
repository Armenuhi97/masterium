import { Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { RoomList, RoomMember } from 'src/app/core/models/chat';

@Component({
  selector: 'app-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MemberItemComponent implements OnInit {
  @Output() selectRoom: EventEmitter<number> = new EventEmitter<number>();
  @Input() active: boolean;
  @Input('room') set setRoom(room: RoomList) {
    this.room = room;    
    this.member = room.room.room_members.find(r => r.user.user_role.code !== 'ADM');
  }
  public member: RoomMember;
  public room: RoomList;
  constructor() {

  }

  ngOnInit(): void {
  }

  public onSelectRoom(): void {
    this.selectRoom.emit(this.room.room.id);
  }
}

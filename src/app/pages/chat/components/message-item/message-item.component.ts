import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/core/models/chat';

@Component({
  selector: 'app-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
  @Input() isIncoming: boolean;

  @Input() message: Message;
  windowHeight: number;
  constructor() { }

  ngOnInit(): void {
    this.windowHeight = window.innerHeight - 150
  }

  public checkType(): string {
    if (this.message && this.message.file_type) {
      if (this.message.file_type.indexOf('image') > -1) {
        return 'image'
      } else {
        return 'file'
      }
    }
    return
  }

}

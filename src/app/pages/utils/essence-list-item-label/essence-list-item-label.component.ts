import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-essence-list-item-label',
  templateUrl: './essence-list-item-label.component.html',
  styleUrls: ['./essence-list-item-label.component.scss']
})
export class EssenceListItemLabelComponent implements OnInit {
  @Input() label: string;
  @Input() id: number;
  @Input() index: number;
  @Output() onDelete = new EventEmitter<number>();
  @Output() onEdit = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  confirm(): void {
    this.onDelete.emit(this.id);
  }

  edit(): void {
    this.onEdit.emit();
  }

}

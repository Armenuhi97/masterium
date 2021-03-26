import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-service-list-card',
  templateUrl: './service-list-card.component.html',
  styleUrls: ['./service-list-card.component.scss'],
})
export class ServiceListCardComponent implements OnInit {
  @Output() cardClicked = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Input() active: boolean;
  @Input() img: string;
  @Input() title: string;
  @Input() description: string;
  @Input() specialistsCount: number;
  @Input() workloadPercent: number;
  @Input() colorOne: any;
  @Input() colorTwo: any;
  @Input() gradientDegree: any;

  constructor() { }

  ngOnInit(): void {
  }

  onCardClicked(): void {
    this.cardClicked.emit();
  }

  onEdit(): void {
    this.edit.emit();
  }

  onDelete(): void {
    this.delete.emit();
  }
}

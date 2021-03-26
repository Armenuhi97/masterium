import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderSubgroupDragItem } from 'src/app/core/models/order';

@Component({
  selector: 'app-suborders-list',
  templateUrl: './suborders-list.component.html',
  styleUrls: ['./suborders-list.component.css']
})
export class SubordersListComponent implements OnInit {
  @Output() editSuborder: EventEmitter<OrderSubgroupDragItem> = new EventEmitter<OrderSubgroupDragItem>();
  @Input() set suborders(subs: OrderSubgroupDragItem[]) {
    this.showSuborders = subs.filter(order => order.suborderMain?.id);
  }
  public isPaymentControlPanelVisible: boolean;
  public showSuborders: OrderSubgroupDragItem[];

  constructor() { }

  ngOnInit(): void { }

  public onEditSuborder(suborder: OrderSubgroupDragItem): void {
    this.editSuborder.emit(suborder);
  }

  public openPaymentControlModal(): void {
    this.isPaymentControlPanelVisible = true;
  }

  public closePaymentControlModal(): void {
    this.isPaymentControlPanelVisible = false;
  }
}

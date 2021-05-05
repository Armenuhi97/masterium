import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderSubgroupDragItem } from 'src/app/core/models/order';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-suborders-list',
  templateUrl: './suborders-list.component.html',
  styleUrls: ['./suborders-list.component.css']
})
export class SubordersListComponent implements OnInit, OnDestroy {
  @Output() editSuborder: EventEmitter<OrderSubgroupDragItem> = new EventEmitter<OrderSubgroupDragItem>();
  @Output() delete: EventEmitter<number> = new EventEmitter<number>();
  @Input() set suborders(subs: OrderSubgroupDragItem[]) {    
    this.showSuborders = subs.filter(order => order.suborderMain?.id);        
  }
  private _unsubscribe = new Subject<void>()
  public isPaymentControlPanelVisible: boolean;
  public showSuborders: OrderSubgroupDragItem[];
  public debit: number;
  public sub: any;
  constructor(
    private _ordersService: OrdersService,
  ) { }

  ngOnInit(): void { }

  public onEditSuborder(suborder: OrderSubgroupDragItem): void {
    this.editSuborder.emit(suborder);
  }
  public checkExecutor(executor){    
    let executors=[]
    if (executor && executor.length) {
      executors = executor.filter((el) => { return el.is_overman == true })
    }
    if(executors && executors[0]){
      return `${executors[0].user.first_name} ${executors[0]?.user?.last_name}`
    }
    return 
  }
  public openPaymentControlModal(data: OrderSubgroupDragItem): void {
    this.sub = data;
    this.isPaymentControlPanelVisible = true;
  }

  public closePaymentControlModal(): void {
    this.isPaymentControlPanelVisible = false;
  }

  public changeDebetStatus(): void {
    const sendingData = {
      suborder_id: this.sub.suborderMain.id,
      debet_status: this.debit
    }
    this._ordersService.changeDebetStatus(sendingData)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe((res) => {
        this.closePaymentControlModal();
      })
  }

  public changeStatus(data: OrderSubgroupDragItem): void {
    const sure = confirm("Are yo sure");
    if (sure) {
      this._ordersService.changePayedStatus(data.suborderMain.id)
        .pipe(takeUntil(this._unsubscribe))
        .subscribe(() => {
          data.suborderMain.payed = data.suborderMain.payed
        })
    } else {
      setTimeout(() => {
        data.suborderMain.payed = false;
      });
    }
  }


  deleteSuborder(id: number): void {
    const fIndex = this.showSuborders.findIndex(s => s.suborderMain.id === id);
    this._ordersService.deleteSuborder(id)
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(() => {
        this.showSuborders = [...this.showSuborders.slice(0, fIndex), ...this.showSuborders.slice(fIndex + 1)];
      })
  }


  handleDebitChange(debit: number): void {
    this.debit = debit;
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
  }
}

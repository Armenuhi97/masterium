import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { OrderDetail, Order, OrderStatus } from '../../core/models/order';
import { OrdersService } from './orders.service';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  public searchProductControl = new FormControl('');
  public sortItems: string[] = [];
  public isVisible = false;
  public isEditing = false;
  public orders: Order[] = [];
  public pageSize = 10;
  public total: number;
  public unsubscribe$ = new Subject();
  public editingOrderIndex: number;
  public editingOrder: OrderDetail;
  public pageIndex = 1;
  public orderStatuses: OrderStatus[] = [];
  public statusFilterControl: FormControl = new FormControl('');
  public isOrderWithDisputControl: FormControl = new FormControl(false);
  public statusSubOrderFilterControl: FormControl = new FormControl('')
  constructor(
    private ordersService: OrdersService,
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.ordersService.getOrderStatuses(),
      this.ordersService.getOrders(0, this.statusFilterControl.value, this.statusSubOrderFilterControl.value, this.isOrderWithDisputControl.value)
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.orderStatuses = res[0];
        this.total = res[1].count;
        this.orders = res[1].results;
      });
    this.handleOrderStatusChange();
    this.handleSubOrderStatusChange();
    this.handleIsDiputControlChange()
  }
  search() {
    this.pageIndex = 1;
    this.getOrders();
  }
  public handleOrderStatusChange(): void {
    this.statusFilterControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.pageIndex = 1;
        this.getOrders();
      });
  }
  public handleSubOrderStatusChange(): void {
    this.statusSubOrderFilterControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.pageIndex = 1;
        this.getOrders();
      });
  }
  public handleIsDiputControlChange(): void {
    this.isOrderWithDisputControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.pageIndex = 1;
        this.getOrders();
      });
  }

  public getOrders(): void {
    let ordering = this.sortItems && this.sortItems.length ? this.sortItems.join(',') : '';

    const offset = (this.pageIndex - 1) * this.pageSize;
    this.ordersService.getOrders(offset, this.statusFilterControl.value, this.statusSubOrderFilterControl.value, this.isOrderWithDisputControl.value,
      ordering, this.searchProductControl.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((orders) => {
        this.total = orders.count;
        this.orders = orders.results;
      });
  }

  public nzPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.getOrders();
  }
  sort(sort, key: string): void {
    if (sort == 'ascend') {

      this._deleteKeyFromSort(`-${key}`)
      if (this._checkIsExist(key) == -1) {
        this.sortItems.push(key);
        this.getOrders()

      }
    } else {
      if (sort == 'descend') {
        this._deleteKeyFromSort(`${key}`)
        if (this._checkIsExist(`-${key}`) == -1) {
          this.sortItems.push(`-${key}`)
          this.getOrders()
        }
      } else {
        this._deleteKeyFromSort(`${key}`);
        this._deleteKeyFromSort(`-${key}`);
        this.getOrders()

      }
    }
  }
  private _checkIsExist(key: string): number {
    let index = this.sortItems.indexOf(key);
    return index
  }
  private _deleteKeyFromSort(key: string) {
    let index = this.sortItems.indexOf(key);
    if (index > -1) {
      this.sortItems.splice(index, 1)

    }
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { OrderDetail, Order, OrderStatus } from '../../core/models/order';
import { OrdersService } from './orders.service';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
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
  constructor(
    private ordersService: OrdersService,
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.ordersService.getOrderStatuses(),
      this.ordersService.getOrders(this.pageIndex, 0, this.statusFilterControl.value),
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res) => {
        this.orderStatuses = res[0];
        this.total = res[1].count;
        this.orders = res[1].results;
      });
    this.handleOrderStatusChange();
  }

  public handleOrderStatusChange(): void {
    this.statusFilterControl.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.getOrders();
      });
  }

  public getOrders(): void {
    const offset = (this.pageIndex - 1) * this.pageSize;
    this.ordersService.getOrders(this.pageIndex, offset, this.statusFilterControl.value)
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

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

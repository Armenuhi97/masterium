import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExecutorsResponse, Order, OrderDetail, OrderRequest, OrderStatus } from '../../core/models/order';
import { ServerResponce } from 'src/app/core/models/server-responce';

@Injectable()
export class OrdersService {

  constructor(private httpClient: HttpClient) { }

  getOrders(offset: number, status: string, subOrderStatus: string, isHasDisput: boolean, ordering = '', search = ''): Observable<ServerResponce<Order[]>> {
    let url = `orders/order-list/?limit=10&offset=${offset}&status=${status}&order_suborders__status=${subOrderStatus}&ordering=${ordering}&search=${search}`;
    if (isHasDisput) {
      url += `&has_disput=True`
    }
    // http://api.masterium.ge/orders/order-list/?has_disput=True&status=4&order_suborders__status=1
    return this.httpClient.get<ServerResponce<Order[]>>(url);
  }

  getOrderStatuses(): Observable<OrderStatus[]> {
    return this.httpClient.get<OrderStatus[]>(`utils/order-status/`);
  }

  saveSuborder(suborder: OrderRequest): Observable<{}> {
    return this.httpClient.post<{}>(`orders/save-suborder/`, suborder);
  }

  editSuborder(suborder: OrderRequest): Observable<{}> {
    return this.httpClient.post<{}>(`orders/edit-suborder/`, suborder);
  }

  deleteSuborder(id: number): Observable<void> {
    return this.httpClient.delete<void>('orders/delete-suborder/' + id + '/')
  }

  getOrderById(id: number): Observable<OrderDetail> {
    return this.httpClient.get<OrderDetail>(`orders/get-order/${id}/`);
  }

  searchForServices(term: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('skipLoading', 'true');
    return this.httpClient.get<any>(`services/search-service/${term}/`);
  }

  getExecutors(subserviceIds: string = '', executorId: number): Observable<ExecutorsResponse> {
    let url = `userdetails/get-executors-by-subservice/${executorId}/?is_active=true`;
    if (subserviceIds) {
      url += `&subservices=${subserviceIds}`
    }
    return this.httpClient.get<ExecutorsResponse>(url);
  }

  searchForProducts(term: string): Observable<any> {
    return this.httpClient.get<any>(`products/search-product/${term}/`);
  }

  setPendingOrder(orderId: number): Observable<{}> {
    return this.httpClient.post<any>(`orders/processed-order/${orderId}/`, {});
  }

  cancelOrder(orderId: number): Observable<{}> {
    return this.httpClient.get<any>(`orders/set-order-status-canceled/${orderId}/`);
  }

  changeDebetStatus(data): Observable<void> {
    return this.httpClient.post<void>('orders/change-debet-status/', data)
  }

  changePayedStatus(data: number) {
    return this.httpClient.post<void>('orders/set-suborder-payed-or-not-payed/', {
      suborder_id: data
    })
  }
}

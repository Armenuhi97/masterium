import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExecutorsResponse, Order, OrderDetail, OrderRequest, OrderStatus } from '../../core/models/order';
import { ServerResponce } from 'src/app/core/models/server-responce';

@Injectable()
export class OrdersService {

  constructor(private httpClient: HttpClient) { }

  getOrders(page: number, offset: number, status: string): Observable<ServerResponce<Order[]>> {
    return this.httpClient.get<ServerResponce<Order[]>>(`orders/order-list/?limit=10&offset=${offset}&page=1&status__code=${status}`);
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

  getOrderById(id: number): Observable<OrderDetail> {
    return this.httpClient.get<OrderDetail>(`orders/get-order/${id}/`);
  }

  searchForServices(term: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('skipLoading', 'true');
    return this.httpClient.get<any>(`services/search-service/${term}/`);
  }

  getExecutors(): Observable<ExecutorsResponse> {
    return this.httpClient.get<ExecutorsResponse>(`userdetails/get-executor-list/`);
  }

  searchForProducts(term: string): Observable<any> {
    return this.httpClient.get<any>(`products/search-product/${term}/`);
  }

  setPendingOrder(orderId: number): Observable<{}> {
    return this.httpClient.post<any>(`orders/processed-order/${orderId}/`, {});
  }

  cancelOrder(orderId: number): Observable<{}> {
    return this.httpClient.post<any>(`orders/set-suborder-status-canceled/${orderId}/`, {});
  }
}

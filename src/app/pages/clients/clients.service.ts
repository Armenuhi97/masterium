import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientDetail, ClientList, ClientOrderHistoryResponse, ClientRequest, CompanyType } from '../../core/models/user';
import { ServerResponce } from 'src/app/core/models/server-responce';
import { CreateRoomResponse } from 'src/app/core/models/chat';

@Injectable()
export class ClientsService {
  constructor(private httpClient: HttpClient) { }

  addClient(user: ClientRequest): Observable<ClientList> {
    return this.httpClient.post<ClientList>(`userdetails/add-client/`, user);
  }

  editClient(id: number, user: ClientRequest): Observable<ClientList> {
    return this.httpClient.put<ClientList>(`userdetails/edit-client/${id}/`, user);
  }

  getClients(page: number): Observable<ServerResponce<ClientList[]>> {
    return this.httpClient.get<ServerResponce<ClientList[]>>(`userdetails/get-client-list/?page=${page}`);
  }

  getClientById(id: number): Observable<ClientDetail> {
    return this.httpClient.get<ClientDetail>(`userdetails/get-client/${id}/`);
  }
  getClientOrders(id: number, offset: number): Observable<ClientOrderHistoryResponse[]> {
    return this.httpClient.post<ClientOrderHistoryResponse[]>(`orders/get-client-orders/${id}/`, {
      start_index: offset,
      status_id: null
    });
  }

  getClientDisputsHistory(id: number, page: number): Observable<any> {
    return this.httpClient.get(`/orders/get-client-suborders-with-disput/${id}/?page=${page}`);
  }

  deleteClient(userId: number): Observable<{}> {
    return this.httpClient.delete<{}>(`userdetails/delete-client/${userId}/`);
  }

  getCompanyTypes(): Observable<CompanyType[]> {
    return this.httpClient.get<CompanyType[]>('utils/company-type/');
  }

  public chatWithUser(id: number): Observable<CreateRoomResponse> {
    return this.httpClient.get<CreateRoomResponse>(`chat/get-room-for-admin/${id}/`);
  }
  public changeExecutorStatus(id: number) {
    return this.httpClient.get(`userdetails/change-activeness/${id}/`)
  }
}

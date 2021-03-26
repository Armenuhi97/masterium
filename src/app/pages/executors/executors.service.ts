import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ExecutorBoard,
  ExecutorFineRequest,
  ExecutorOrderHistoryResponse,
  ExecutorRequest,
  ExecutorSalaryRequest,
  RewardByPeriodRequest,
  User,
  UserDetail,
} from 'src/app/core/models/user';
import { Subcategory } from '../../core/models/services';
import { EssenceItem } from '../../core/models/utils';
import { ServerResponce } from 'src/app/core/models/server-responce';
import { CreateRoomResponse } from 'src/app/core/models/chat';

@Injectable()
export class ExecutorsService {
  constructor(private httpClient: HttpClient) { }

  public addExecutor(user: ExecutorRequest): Observable<User> {
    return this.httpClient.post<User>(`userdetails/add-executor/`, user);
  }

  public getExecutors(page: number): Observable<ServerResponce<User[]>> {
    return this.httpClient.get<ServerResponce<User[]>>(`userdetails/get-executor-list/?page=${page}`);
  }

  public getExecutorById(id: number): Observable<UserDetail> {
    return this.httpClient.get<UserDetail>(`userdetails/get-executor/${id}/`);
  }

  public editExecutor(id: number, user: ExecutorRequest): Observable<User> {
    return this.httpClient.put<User>(`userdetails/edit-executor/${id}/`, user);
  }

  public deleteExecutor(userId: number): Observable<{}> {
    return this.httpClient.delete<{}>(`userdetails/delete-executor/${userId}/`);
  }

  public getAllSubcategories(): Observable<Subcategory[]> {
    return this.httpClient.get<Subcategory[]>('services/subcategory/');
  }

  public getUserAttachmentTypes(): Observable<EssenceItem[]> {
    return this.httpClient.get<EssenceItem[]>('utils/user-attachment-type/');
  }

  public getSpecializations(): Observable<EssenceItem[]> {
    return this.httpClient.get<EssenceItem[]>('utils/specialization/');
  }

  public getExecutorOrderHistory(
    id: number
  ): Observable<{ results: ExecutorOrderHistoryResponse[] }> {
    return this.httpClient.get<{ results: ExecutorOrderHistoryResponse[] }>(
      `orders/get-executor-suborders/${id}/`
    );
  }

  public getExecutorDistupOrderHistory(
    id: number
  ): Observable<{ results: ExecutorOrderHistoryResponse[] }> {
    return this.httpClient.get<{ results: ExecutorOrderHistoryResponse[] }>(
      `orders/get-executor-suborders-with-disput/${id}/`
    );
  }

  public getRewardByPeriod(data: RewardByPeriodRequest): Observable<any> {
    return this.httpClient.get<any>(
      `orders/get-executor-sum/${data.userId}/?start_date=${data.startDate}&end_date=${data.endDate}`
    );
  }

  public fineUser(data: ExecutorFineRequest): Observable<void> {
    return this.httpClient.post<void>(`userdetails/save-penalty/`, data);
  }

  public giveUserSalarys(data: ExecutorSalaryRequest): Observable<void> {
    return this.httpClient.post<void>(`userdetails/save-salary/`, data);
  }

  public getExecuteBoards(page: number, id: number): Observable<ServerResponce<ExecutorBoard[]>> {
    return this.httpClient.get<ServerResponce<ExecutorBoard[]>>(`products/get-executor-board/${id}/?page=${page}`);
  }

  public changeExecuteBoardCount(id: number, quantity: number): Observable<any> {
    return this.httpClient.post(`products/change-board-item-count/${id}/`, { quantity });
  }

  public addExecutorBoard(id: number, body): Observable<any> {
    return this.httpClient.post(`products/add-product-in-executor-board/${id}/`, body);
  }

  public updateExecutorBoard(id: number, body): Observable<any> {
    return this.httpClient.put(`products/edit-board-item-product/${id}/`, body);
  }

  public getBoardById(id): Observable<any> {
    return this.httpClient.get(`products/get-board-item/${id}/`);
  }

  public chatWithUser(id: number): Observable<CreateRoomResponse> {
    return this.httpClient.get<CreateRoomResponse>(`chat/get-room-for-admin/${id}/`);
  }
  public changeExecutorStatus(id: number) {
    return this.httpClient.get(`userdetails/change-activeness/${id}/`)
  }
}

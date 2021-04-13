import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExecutorFinancesDetails, FinancesDebetList } from '../models/finances';
import { MarketProduct } from '../models/market';
import { ServerResponce } from '../models/server-responce';
import { ExecutorFineRequest, ExecutorSumResponse } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class FinancesService {
    constructor(private _httpClient: HttpClient) { }

    public getProducts(pageIndex: number): Observable<ServerResponce<MarketProduct>> {
        let params = new HttpParams();
        params = params.append('page', pageIndex.toString());
        return this._httpClient.get<ServerResponce<MarketProduct>>('products/product/', { params });
    }

    public getExecutorsStatistic(page: number, range: string[]): Observable<ServerResponce<ExecutorSumResponse[]>> {
        let params = new HttpParams();
        params = params.append('start_date', range[0]);
        params = params.append('end_date', range[1]);
        params = params.append('page', page.toString());
        return this._httpClient.get<ServerResponce<ExecutorSumResponse[]>>('orders/get-all-executors-sum/', { params });
    }

    public fineExecutor(data: ExecutorFineRequest): Observable<void> {
        return this._httpClient.post<void>(`userdetails/save-penalty/`, data);
    }

    public getExecutorDetails(id: number, range: string[]): Observable<ExecutorFinancesDetails> {
        let params = new HttpParams();
        params = params.append('start_date', range[0]);
        params = params.append('end_date', range[1]);
        return this._httpClient.get<ExecutorFinancesDetails>(`orders/get-executor-detailed-suborders/${id}/`, { params });
    }

    public getClientsDebet(): Observable<FinancesDebetList[]> {
        return this._httpClient.get<FinancesDebetList[]>(`orders/get-clients-debet/`);
    }

    public getExecutorsDebet(): Observable<FinancesDebetList[]> {
        return this._httpClient.get<FinancesDebetList[]>(`orders/get-executors-debet/`);
    }
}

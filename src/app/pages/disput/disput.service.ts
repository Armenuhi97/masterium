import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Disput, DisputList, DisputStatus } from 'src/app/core/models/disput.model';
import { ServerResponce } from 'src/app/core/models/server-responce';


@Injectable()
export class DisputService {
    constructor(private httpClient: HttpClient) { }

    public getAllDisputs(offset: number, status: number): Observable<ServerResponce<DisputList[]>> {
        return this.httpClient.get<ServerResponce<DisputList[]>>(`/orders/disput/?limit=10&offset=${offset}&page=1&status_id=${status}`);
    }

    public getDisputById(id: number): Observable<Disput> {
        return this.httpClient.get<Disput>(`orders/disput/${id}/`);
    }

    public closeDisput(id: number): Observable<{}> {
        return this.httpClient.get<{}>(`orders/complete-disput-by-admin/${id}/`);
    }

    public getDisputStatuses(): Observable<DisputStatus[]> {
        return this.httpClient.get<DisputStatus[]>(`utils/disput-status/`);
    }

}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {AdvertisementType, Advertisement, AdvertisementResponse} from 'src/app/core/models/advertisment';
import { ServerResponce } from 'src/app/core/models/server-responce';
import {Promotion} from '../../core/models/promotion';

@Injectable()
export class AdvertisementService {

    constructor(private httpClient: HttpClient) { }

    public getAdvertisements(): Observable<AdvertisementResponse[]> {
        return this.httpClient.get<AdvertisementResponse[]>(`advertisements/advertisements/`);
    }

    public deleteAdvertisement(id: number): Observable<{}> {
        return this.httpClient.delete<{}>(`advertisements/advertisements/${id}/`);
    }

    public postAdvertisement(advertisement: Advertisement): Observable<AdvertisementResponse>{
        return this.httpClient.post<AdvertisementResponse>(`advertisements/advertisements/`, advertisement);
    }

    public editAdvertisement(advertisement: Advertisement, advertisementId: number): Observable<AdvertisementResponse> {
        return this.httpClient.put<AdvertisementResponse>(`advertisements/advertisements/${advertisementId}/`, advertisement);
    }

    public getAdvertisementTypes(): Observable<ServerResponce<AdvertisementType[]>> {
      return this.httpClient.get<ServerResponce<AdvertisementType[]>>(`utils/advertisement-type/`);
    }

    getPromotions(): Observable<Promotion[]> {
      return this.httpClient.get<Promotion[]>('advertisements/sale/');
    }

}

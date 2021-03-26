import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EssenceType } from 'src/app/core/models/essence';
import {EssenceItem} from '../../core/models/utils';

@Injectable()
export class UtilsService {

    constructor(private httpClinet: HttpClient) { }

    public getEssence(essenceType: string): Observable<EssenceItem[]> {
        return this.httpClinet.get<EssenceItem[]>(`utils/${essenceType}/`);
    }

    public postEssenceItem(essenceType: string, body: EssenceItem): Observable<{}> {
      return this.httpClinet.post<{}>(`utils/${essenceType}/`, body);
    }

    public deleteEssenceItem(essenceType: string, id: number): Observable<{}> {
        return this.httpClinet.delete<{}>(`utils/${essenceType}/${id}/`);
    }

    public editEssenceItem(essenceType: string, essenceValue: any, id: number): Observable<{}> {
        return this.httpClinet.put<{}>(`utils/${essenceType}/${id}/`, essenceValue);
    }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Measurment } from '../models/measurment';
@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    constructor(private httpClient: HttpClient) { }

    public getMeasurments(): Observable<Measurment[]> {
        return this.httpClient.get<Measurment[]>(`utils/measurement-type/`);
    }
}

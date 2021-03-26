import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Metrics } from '../models/metrics';

@Injectable({
    providedIn: 'root'
})
export class MetricsService {
    constructor(private _httpClient: HttpClient) { }

    public getMetrics(): Observable<Metrics> {
        return this._httpClient.get<Metrics>('chat/get-unseen-items-count/');
    }
}
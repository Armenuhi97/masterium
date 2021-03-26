import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/user';
import { Specialization } from '../models/utils';

@Injectable({
  providedIn: 'root'
})
export class MainService {
  constructor(
    private httpClient: HttpClient,
  ) { }

  public uploadFile(file): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file_url', file);
    return this.httpClient.post<{ url: string }>(`files/files/`, formData);
  }

}

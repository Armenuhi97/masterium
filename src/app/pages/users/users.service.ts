import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/user';

@Injectable()
export class UsersService {

  constructor(private httpClient: HttpClient) {}

  public addExecutor(user: User): Observable<{}> {
    return this.httpClient.post<{}>(`userdetails/add-executor/`, user);
  }

  public getExecutors(userTypeId: number): Observable<User[]> {
    return this.httpClient.get<User[]>(`userdetails/get-executor-list/`);
  }

  public editUser(user: User): Observable<{}> {
    return this.httpClient.put<{}>(`userdetails/edit-executor/${user.user}/`, user);
  }

  public deleteUser(userId: number): Observable<{}> {
    return this.httpClient.delete<{}>(`user/user/${userId}`);
  }
}

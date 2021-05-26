import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AuthService {

    constructor(private _httpClient: HttpClient) { }

    public login(username: string, password: string) {
        return this._httpClient.post('login/admin-login/',
            {
                username: username,
                password: password
            })
    }


}

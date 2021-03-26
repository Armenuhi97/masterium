import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss'],
})

export class LoginComponent implements OnInit {

    signInForm: FormGroup;
    errorMessage: string;

    constructor(
        private _fb: FormBuilder,
        private _router: Router,
        private _authService: AuthService,
        private _cookieService:CookieService
    ) { }

    ngOnInit(): void {
        this.formBuilder();
    }


    formBuilder(): void {
        this.signInForm = this._fb.group({
            userName: ['admin@admin.com', [Validators.required]],
            password: ['123456', [Validators.required]],
            remember: [true]
        });
    }

    getValidationError(controlName): boolean {
        return this.signInForm.get(controlName).hasError('required') && this.signInForm.get(controlName).touched;
    }

    submitForm(): void {
        this._cookieService.set('access','ee14e3ede6edcbad00075063b1870231dd688cb0')
        this._router.navigate(['/dashboard/services']);

        // this._authService.login({
        //     email: this.signInForm.value.email,
        //     password: this.signInForm.value.password,
        // }).subscribe((data) => {
        //     this._cookieService.set('refreshToken', data.data.refreshToken);
        //     this._cookieService.set('accessToken', data.data.accessToken);
        //     if (data.data.hasOwnProperty('roleId') && data.data.roleId == 3) {
        //         this._router.navigate(['/articles']);
        //     } else {
        //         this._router.navigate(['/users']);
        //     }
        // },
        //     err => {
        //         console.log(err);

        //     }
        // )

    }
}

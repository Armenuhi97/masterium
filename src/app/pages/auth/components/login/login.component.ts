import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginResponce } from 'src/app/core/models/login';
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
        private _cookieService: CookieService
    ) { }

    ngOnInit(): void {
        this.formBuilder();
    }


    formBuilder(): void {
        this.signInForm = this._fb.group({
            userName: ['admin', [Validators.required]],
            password: ['Gyumri22+', [Validators.required]],
            remember: [true]
        });
    }

    getValidationError(controlName): boolean {
        return this.signInForm.get(controlName).hasError('required') && this.signInForm.get(controlName).touched;
    }

    submitForm(): void {
        this._authService.login(
            this.signInForm.value.userName,
            this.signInForm.value.password,
        ).subscribe((data: LoginResponce) => {
            this._cookieService.set('userId', (data.user.user).toString());
            this._cookieService.set('access', data.token);
            this._router.navigate(['/dashboard/services'])
            // if (data.data.hasOwnProperty('roleId') && data.data.roleId == 3) {
            //     this._router.navigate(['/articles']);
            // } else {
            //     this._router.navigate(['/users']);
            // }
        },
            err => {
                console.log(err);

            }
        )

    }
}

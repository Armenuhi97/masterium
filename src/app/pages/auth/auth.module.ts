import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthRoutingModule } from './auth.routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';

@NgModule({
    declarations: [AuthRoutingModule.components],
    imports: [AuthRoutingModule, ReactiveFormsModule, SharedModule],
    providers: [AuthService]
})

export class AuthModule { }

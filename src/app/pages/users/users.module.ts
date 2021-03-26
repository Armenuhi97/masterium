import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { UsersRoutingModule } from './users-routing.module';
// import { UsersService } from './users.service';
@NgModule({
    declarations: [UsersRoutingModule.components],
    imports: [UsersRoutingModule, SharedModule, CommonModule, FormsModule, ReactiveFormsModule, IconsProviderModule],
    providers: []
})
export class UsersModule { }

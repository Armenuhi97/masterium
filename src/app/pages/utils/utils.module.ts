import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { UtilsRoutingModule } from './utils-routing.module';
import { UtilsService } from './utils.service';
@NgModule({
    declarations: [UtilsRoutingModule.components],
    imports: [UtilsRoutingModule, SharedModule, CommonModule, ReactiveFormsModule, IconsProviderModule],
    providers: [UtilsService]
})
export class UtilsModule { }

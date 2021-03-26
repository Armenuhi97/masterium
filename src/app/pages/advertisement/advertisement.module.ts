import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { AdvertisementRoutingModule } from './advertisement-routing.module';
import { AdvertisementService } from './advertisement.service';
@NgModule({
    declarations: [AdvertisementRoutingModule.components],
    imports: [AdvertisementRoutingModule, SharedModule, CommonModule, ReactiveFormsModule, IconsProviderModule],
    providers: [AdvertisementService]
})
export class AdvertisementModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { ServicesRoutingModule } from './services-routing.module';
import { ServicesService } from './services.service';
import { CreateEditSubcategoryComponent } from './components/create-edit-subcategory/create-edit-subcategory.component';
import { ServiceItemComponent } from './components/service-item/service-item.component';
import { CreateEditServiceComponent } from './components/create-edit-service/create-edit-service.component';
import { CreateEditSubserviceComponent } from './components/create-edit-subservice/create-edit-subservice.component';
import { ColorPickerModule } from 'ngx-color-picker';

@NgModule({
  declarations: [
    ServicesRoutingModule.components,
    CreateEditSubcategoryComponent,
    ServiceItemComponent,
    CreateEditServiceComponent,
    CreateEditSubserviceComponent
  ],
  imports: [
    ColorPickerModule,
    ServicesRoutingModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconsProviderModule
  ],
  providers: [ServicesService]
})
export class ServicesModule { }

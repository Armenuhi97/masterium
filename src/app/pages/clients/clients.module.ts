import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsService } from './clients.service';

@NgModule({
  declarations: [ClientsRoutingModule.components],
  imports: [ClientsRoutingModule, SharedModule, CommonModule, ReactiveFormsModule, FormsModule, IconsProviderModule],
  providers: [ClientsService]
})
export class ClientsModule { }

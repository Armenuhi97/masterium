import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { DisputDetailComponent } from './disput-detail.component/disput-detail.component';
import { DisputRoutingModule } from './disput-routing.module';
import { DisputService } from './disput.service';

@NgModule({
  declarations: [DisputRoutingModule.components, DisputDetailComponent],
  imports: [DisputRoutingModule, SharedModule, CommonModule, ReactiveFormsModule, IconsProviderModule, FormsModule],
  providers: [DisputService]
})
export class DisputModule { }

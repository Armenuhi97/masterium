import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { PromotionsRoutingModule } from './promotions-routing.module';
import { PromotionService } from './promotion.service';
@NgModule({
  declarations: [PromotionsRoutingModule.components],
  imports: [PromotionsRoutingModule, SharedModule, CommonModule, ReactiveFormsModule, IconsProviderModule, FormsModule],
  providers: [PromotionService]
})
export class PromotionsModule { }

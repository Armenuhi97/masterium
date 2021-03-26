import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancesRoutingModule } from './finances-routing.module';
import {
  FinancesTabComponent,
  FinancesProductsComponent,
  FinancesExecutorsComponent,
  FinancesExecutorsDetailsComponent,
  DebitDeptComponent
} from './components/';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    FinancesRoutingModule.components,
    FinancesTabComponent,
    FinancesProductsComponent,
    FinancesExecutorsComponent,
    FinancesExecutorsDetailsComponent,
    DebitDeptComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FinancesRoutingModule,
    SharedModule,
    IconsProviderModule
  ]
})
export class FinancesModule { }

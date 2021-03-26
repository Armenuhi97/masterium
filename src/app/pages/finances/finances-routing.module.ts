import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinancesComponent } from './pages/finances/finances.component';

const routes: Routes = [{ path: '', component: FinancesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancesRoutingModule {
  static components = [FinancesComponent];
}

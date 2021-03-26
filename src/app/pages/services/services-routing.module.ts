import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServicesComponent } from './services.component';
import { CreateEditCategoryComponent } from './components/create-edit-category/create-edit-category.component';

const routes: Routes = [
  { path: '', component: ServicesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule {
  static components = [ServicesComponent,  CreateEditCategoryComponent];
}

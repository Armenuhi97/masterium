import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './client/client.component';
import {ClientsComponent} from './clients.component';

const routes: Routes = [
  { path: '', component: ClientsComponent },
  { path: ':id', component: ClientComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule {
  static components = [ClientsComponent, ClientComponent];
}

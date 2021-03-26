import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExecutorComponent } from './executor/executor.component';
import { ExecutorsComponent } from './executors.component';

const routes: Routes = [
  { path: '', component: ExecutorsComponent },
  { path: ':id', component: ExecutorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutorsRoutingModule {
  static components = [ExecutorsComponent, ExecutorComponent];
}

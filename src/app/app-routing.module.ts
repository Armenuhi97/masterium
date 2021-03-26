import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
  { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then((m) => m.AuthModule) },
  { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule) },

  { path: 'finances', loadChildren: () => import('./pages/finances/finances.module').then(m => m.FinancesModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


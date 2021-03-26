import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'dashboard/services', pathMatch: 'full' },
      {
        path: 'users-list',
        loadChildren: () =>
          import('../users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../utils/utils.module').then((m) => m.UtilsModule),
      },
      {
        path: 'market',
        loadChildren: () =>
          import('../market/market.module').then((m) => m.MarketModule),
      },
      {
        path: 'advertisement',
        loadChildren: () =>
          import('../advertisement/advertisement.module').then(
            (m) => m.AdvertisementModule
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('../orders/orders.module').then((m) => m.OrdersModule),
      },
      {
        path: 'services',
        loadChildren: () =>
          import('../services/services.module').then((m) => m.ServicesModule),
      },
      {
        path: 'promotion',
        loadChildren: () =>
          import('../promotions/promotions.module').then(
            (m) => m.PromotionsModule
          ),
      },
      {
        path: 'executors',
        loadChildren: () =>
          import('../executors/executors.module').then(
            (m) => m.ExecutorsModule
          ),
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('../clients/clients.module').then((m) => m.ClientsModule),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('../chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'disput',
        loadChildren: () =>
          import('../disput/disput.module').then((m) => m.DisputModule),
      },
      {
        path: 'markets',
        loadChildren: () =>
          import('../markets/markets.module').then((m) => m.MarketsModule),
      },
      {
        path: 'finances',
        loadChildren: () =>
          import('../finances/finances.module').then((m) => m.FinancesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }

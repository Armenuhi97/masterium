import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersService } from './orders.service';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderGroupFilterPipe } from './order-group-filter.pipe';
import { CategoryAutocompleteComponent } from './category-autocomplete/category-autocomplete.component';
import { SubordersListComponent } from './suborders-list/suborders-list.component';
import { OrdersPaymentControlPanelComponent } from './orders-payment-control-panel/orders-payment-control-panel.component';

@NgModule({
    declarations: [
        OrdersRoutingModule.components,
        OrderDetailComponent,
        OrderGroupFilterPipe,
        CategoryAutocompleteComponent,
        SubordersListComponent,
        OrdersPaymentControlPanelComponent
    ],
    imports: [
        OrdersRoutingModule,
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IconsProviderModule
    ],
    providers: [OrdersService]
})
export class OrdersModule { }

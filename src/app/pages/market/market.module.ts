import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { MarketRoutingModule } from './market-routing.module';
import { MarketService } from './market.service';
import {MarketListPipe} from './market-list.pipe';
@NgModule({
    declarations: [MarketRoutingModule.components, MarketListPipe],
    imports: [MarketRoutingModule, SharedModule, CommonModule, ReactiveFormsModule, FormsModule, IconsProviderModule],
    providers: [MarketService]
})
export class MarketModule { }

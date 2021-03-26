import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MainRoutingModule } from './main-routing.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
@NgModule({
    declarations: [
        MainComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        MainRoutingModule,
        IconsProviderModule,
    ],
})
export class MainModule { }

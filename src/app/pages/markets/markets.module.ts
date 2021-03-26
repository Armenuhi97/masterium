import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { CreateEditProductCategoryComponent } from './components/create-edit-category/create-edit-category.component';
import { CreateEditProductSubcategoryComponent } from './components/create-edit-subcategory/create-edit-subcategory.component';
import { MarketsRoutingModule } from './markets-routing.module';
import { MarketsComponent } from './markets.component';
import { MarketsService } from './markets.service';

@NgModule({
    declarations: [MarketsComponent, CreateEditProductCategoryComponent, CreateEditProductSubcategoryComponent],
    imports: [MarketsRoutingModule, SharedModule, CommonModule, FormsModule, ReactiveFormsModule, IconsProviderModule],
    providers: [MarketsService]
})
export class MarketsModule { }

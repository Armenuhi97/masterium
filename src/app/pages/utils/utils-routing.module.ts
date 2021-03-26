import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EssenceListItemLabelComponent } from './essence-list-item-label/essence-list-item-label.component';
import { EssenceListItemComponent } from './essence-list-item/essence-list-item.component';
import { UtilsComponent } from './utils.component';

const routes: Routes = [
    { path: '', component: UtilsComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UtilsRoutingModule {
    static components = [UtilsComponent, EssenceListItemComponent, EssenceListItemLabelComponent];
}

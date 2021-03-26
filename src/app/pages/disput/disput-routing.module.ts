import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisputDetailComponent } from './disput-detail.component/disput-detail.component';
import { DisputComponent } from './disput.component';

const routes: Routes = [
    { path: '', component: DisputComponent },
    { path: ':id', component: DisputDetailComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisputRoutingModule {
    static components = [DisputComponent, DisputDetailComponent];
}

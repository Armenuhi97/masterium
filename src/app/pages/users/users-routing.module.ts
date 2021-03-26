import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UsersComponent } from './users.component';

const routes: Routes = [
    { path: '', component: UsersComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule {
    static components = [UsersComponent, EditUserComponent];
}

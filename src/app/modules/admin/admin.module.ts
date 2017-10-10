import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminComponent,
    AdminHeaderComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminUserComponent
  ]
})
export class AdminModule {
}

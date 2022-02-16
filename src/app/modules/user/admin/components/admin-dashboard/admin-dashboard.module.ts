import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PipeModule } from '../../../../../pipe/pipe.module';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminMissionsListModule } from '../admin-missions-list/admin-missions-list.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    PipeModule,
    AdminMissionsListModule,
    FormsModule
  ],
  declarations: [
    AdminDashboardComponent
  ],
  exports: [
    AdminDashboardComponent
  ]
})

export class AdminDashboardModule { }

// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTableModule } from '../shared-table/table.module';
import {SidebarModule} from '../../../sidebar/sidebar.module';


// Components
 import { SharedProsListComponent } from './shared-pros-list.component';
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedTableModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedProsListComponent
  ],
  exports: [
    SharedProsListComponent
  ]
})

export class SharedProsListModule { }

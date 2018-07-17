// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { SharedSearchProsComponent } from './shared-search-pros.component';
import {SidebarModule} from '../../../sidebar/sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SidebarModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedSearchProsComponent
  ],
  exports: [
    SharedSearchProsComponent
  ]
})

export class SharedSearchProsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { EmailsFormComponent } from './emails-form.component';

import { SidebarModule } from '../../templates/sidebar/sidebar.module';
import { TableModule } from '../../../table/table.module';
import { AutoCompleteInputModule } from '../../../utility-components/auto-complete-input/auto-complete-input.module';
import { InputListModule } from '../../../utility-components/input-list/input-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
    TableModule,
    AutoCompleteInputModule,
    InputListModule
  ],
  declarations: [
   EmailsFormComponent
  ],
  exports: [
    EmailsFormComponent
  ]
})

export class SidebarEmailFormModule {}

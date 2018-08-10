import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserFormComponent } from './user-form.component';
import { AutocompleteInputModule } from '../../../input/component/autocomplete-input/autocomplete-input.module';
import { SharedTagItemModule } from '../../../shared/components/shared-tag-item/shared-tag-item.module';
import { SidebarModule } from '../../sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    AutocompleteInputModule,
    SharedTagItemModule,
    SidebarModule
  ],
  declarations: [
    UserFormComponent
  ],
  exports: [
    UserFormComponent
  ]
})

export class SidebarUserFormModule {}

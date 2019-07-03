import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AddAmbassadorFormComponent } from './add-ambassador-form.component';
import { AutocompleteInputModule } from '../../../utility-components/autocomplete-input/autocomplete-input.module';
import { SharedTagModule } from '../../../shared/components/shared-tag-item/shared-tag.module';
import { SidebarModule } from '../../sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    AutocompleteInputModule,
    SharedTagModule,
    SidebarModule
  ],
  declarations: [
    AddAmbassadorFormComponent
  ],
  exports: [
    AddAmbassadorFormComponent
  ]
})

export class SidebarAddAmbassadorFormModule {}

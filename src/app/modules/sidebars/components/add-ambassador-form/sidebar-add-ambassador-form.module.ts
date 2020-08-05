import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AddAmbassadorFormComponent } from './add-ambassador-form.component';
import { AutoCompleteInputModule } from '../../../utility/auto-complete-input/auto-complete-input.module';
import { SharedTagsModule } from '../../../shared/components/shared-tags/shared-tags.module';
import { SidebarModule } from '../../templates/sidebar/sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    AutoCompleteInputModule,
    SharedTagsModule,
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

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarModule } from '../../sidebar.module';
import { CSVUploadFormComponent } from './csvupload-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
  ],
  declarations: [
    CSVUploadFormComponent
  ],
  exports: [
    CSVUploadFormComponent
  ]
})

export class SidebarCSVUploadFormModule {}

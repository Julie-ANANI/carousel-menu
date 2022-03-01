import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CheckBoxFilterComponent} from './check-box-filter.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MessageTemplateModule} from '../messages/message-template/message-template.module';
import {SearchInputModule} from '@umius/umi-common-component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MessageTemplateModule,
    SearchInputModule,
  ],
  declarations: [CheckBoxFilterComponent],
  exports: [CheckBoxFilterComponent],
})
export class CheckBoxFilterModule {}

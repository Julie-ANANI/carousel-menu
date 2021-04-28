import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CheckBoxFilterComponent} from './check-box-filter.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SearchInput2Module} from '../search-inputs/search-template-2/search-input-2.module';
import {MessageTemplateModule} from '../messages/message-template/message-template.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SearchInput2Module,
    MessageTemplateModule,
  ],
  declarations: [CheckBoxFilterComponent],
  exports: [CheckBoxFilterComponent],
})
export class CheckBoxFilterModule {}

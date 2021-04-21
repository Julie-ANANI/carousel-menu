import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CheckBoxFilterComponent} from './check-box-filter.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  declarations: [CheckBoxFilterComponent],
  exports: [CheckBoxFilterComponent],
})
export class CheckBoxFilterModule {}

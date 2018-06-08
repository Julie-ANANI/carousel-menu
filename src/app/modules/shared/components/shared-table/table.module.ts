// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { SharedTableComponent } from './components/shared-table.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedTableComponent
  ],
  exports: [
    SharedTableComponent
  ]
})

export class TableModule { }

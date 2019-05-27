// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { SharedAdvancedSearchComponent } from './shared-advanced-search.component';
import {TableModule} from '../../../table/table.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TableModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedAdvancedSearchComponent
  ],
  exports: [
    SharedAdvancedSearchComponent
  ]
})

export class SharedAdvancedSearchModule { }

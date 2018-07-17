// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { SharedPaginationComponent} from './shared-pagination.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedPaginationComponent
  ],
  exports: [
    SharedPaginationComponent
  ]
})

export class SharedPaginationModule { }

// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
// import {FormsModule} from '@angular/forms';

// Components
import { SharedSortComponent} from './shared-sort.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedSortComponent
  ],
  exports: [
    SharedSortComponent
  ]
})

export class SharedSortModule { }

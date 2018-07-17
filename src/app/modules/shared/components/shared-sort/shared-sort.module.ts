// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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

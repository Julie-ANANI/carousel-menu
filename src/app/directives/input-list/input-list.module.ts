/**
 * Created by Valentin on 10/07/2018.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { InputListComponent} from './input-list.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
    RouterModule
  ],
  declarations: [
    InputListComponent
  ],
  exports: [
    InputListComponent
  ]
})

export class InputListModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {SharedLatexManagerComponent} from './shared-latex-manager.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedLatexManagerComponent
  ],
  exports: [
    SharedLatexManagerComponent
  ]
})

export class SharedLoaderModule { }

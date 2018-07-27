// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedSearchMailComponent } from './shared-search-mail.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedSearchMailComponent
  ],
  exports: [
    SharedSearchMailComponent
  ]
})

export class SharedSearchMailModule { }

// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from './footer.component';

// Components

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild()
  ],
  declarations: [
    FooterComponent
  ],
  exports: [
    FooterComponent
  ]
})

export class FooterModule { }

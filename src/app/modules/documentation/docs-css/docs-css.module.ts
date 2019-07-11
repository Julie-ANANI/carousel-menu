import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DocsCssRoutingModule } from './docs-css-routing.module';

import { DocsCssComponent } from './docs-css.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    DocsCssRoutingModule
  ],
  declarations: [
    DocsCssComponent
  ],
})

export class DocsCssModule {
}


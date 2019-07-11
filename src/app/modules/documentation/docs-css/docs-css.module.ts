import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DocsCssRoutingModule } from './docs-css-routing.module';

import { DocsCssComponent } from './docs-css.component';

import { OverviewComponent } from './overview/overview.component';

import { AccordionsComponent } from './components/accordions/accordions.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    DocsCssRoutingModule
  ],
  declarations: [
    DocsCssComponent,
    OverviewComponent,
    AccordionsComponent
  ],
})

export class DocsCssModule {
}


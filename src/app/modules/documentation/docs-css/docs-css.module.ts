import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DocsCssRoutingModule } from './docs-css-routing.module';

import { DocsCssComponent } from './docs-css.component';

import { OverviewComponent } from './overview/overview.component';

import { AccordionsComponent } from './components/accordions/accordions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TypographyComponent } from './elements/typography/typography.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    DocsCssRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    DocsCssComponent,
    OverviewComponent,
    TypographyComponent,
    AccordionsComponent,
  ],
})

export class DocsCssModule {
}


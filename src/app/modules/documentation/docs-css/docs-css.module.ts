import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DocsCssRoutingModule } from './docs-css-routing.module';

import { DocsCssComponent } from './docs-css.component';
import { OverviewComponent } from './overview/overview.component';
import { AccordionsComponent } from './components/accordions/accordions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TypographyComponent } from './elements/typography/typography.component';
import { TableComponent } from './elements/table/table.component';
import { ButtonComponent } from './elements/button/button.component';
import { LabelComponent } from './elements/label/label.component';
import { CodeComponent } from './elements/code/code.component';
import { MediaComponent } from './elements/media/media.component';
import { FormComponent } from './elements/form/form.component';
import { CloseComponent } from './elements/close/close.component';
import { ColorsComponent } from './utilities/colors/colors.component';
import { CursorsComponent } from './utilities/cursors/cursors.component';
import { DisplayComponent } from './utilities/display/display.component';
import { DividerComponent } from './utilities/divider/divider.component';
import { IconComponent } from './elements/icon/icon.component';
import { LoadingComponent } from './utilities/loading/loading.component';

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
    TableComponent,
    LabelComponent,
    AccordionsComponent,
    ButtonComponent,
    CodeComponent,
    MediaComponent,
    FormComponent,
    CloseComponent,
    ColorsComponent,
    CursorsComponent,
    DisplayComponent,
    DividerComponent,
    IconComponent,
    LoadingComponent
  ],
})

export class DocsCssModule {
}


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DocumentationRoutingModule } from './documentation-routing.module';

import { ChangelogComponent } from './changelog/changelog.component';
import { DocumentationComponent } from './documentation.component';

import { DocsCssModule } from './docs-css/docs-css.module';
import { HeaderModule } from '../common/header/header.module';
import { FooterModule } from '../common/footer/footer.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    DocumentationRoutingModule,
    DocsCssModule,
    HeaderModule,
    FooterModule
  ],
  declarations: [
    DocumentationComponent,
    ChangelogComponent
  ],
})

export class DocumentationModule { }


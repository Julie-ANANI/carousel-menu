// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PipeModule } from '../../../../pipe/pipe.module';

// Components
import { SharedTextZoneComponent } from './shared-text-zone.component';
import {CleanHtmlModule} from '../../../../pipe/cleanHtml/cleanHtml.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeModule,
    TranslateModule.forChild(),
    CleanHtmlModule
  ],
  declarations: [
    SharedTextZoneComponent
  ],
  exports: [
    SharedTextZoneComponent
  ]
})

export class SharedTextZoneModule { }

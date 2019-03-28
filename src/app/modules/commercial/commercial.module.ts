import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { HeaderModule } from '../common/header/header.module';
import { FooterModule } from '../common/footer/footer.module';

import { CommercialComponent } from './commercial.component';

import { CommercialRoutingModule } from './commercial-routing.module';
import { SharedWorldmapModule } from '../shared/components/shared-worldmap/shared-worldmap.module';
import { TagsService } from '../../services/tags/tags.service';
import { PipeModule } from '../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    HeaderModule,
    FooterModule,
    SharedWorldmapModule,
    PipeModule,
    CommercialRoutingModule,
  ],
  declarations: [
    CommercialComponent
  ],
  providers: [
    TagsService,
  ],
  exports: [
    CommercialComponent,
  ]
})

export class CommercialModule { }

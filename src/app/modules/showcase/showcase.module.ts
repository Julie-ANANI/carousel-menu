import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminSearchMapModule } from '../user/admin/components/admin-search/admin-search-map/admin-search-map.module';
import { CountryFlagModule } from '../utility-components/country-flag/country-flag.module';
import { FooterModule } from '../common/footer/footer.module';
import { HeaderModule } from '../common/header/header.module';
import { ModalModule } from '../utility-components/modal/modal.module';

import { ShowcaseComponent } from './showcase.component';

import { ShowcaseRoutingModule } from './showcase-routing.module';
import { AnswerService } from '../../services/answer/answer.service';
import { TagsService } from '../../services/tags/tags.service';
import { PipeModule } from '../../pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    AdminSearchMapModule,
    CountryFlagModule,
    FooterModule,
    HeaderModule,
    ModalModule,
    PipeModule,
    ShowcaseRoutingModule
  ],
  declarations: [
    ShowcaseComponent
  ],
  providers: [
    AnswerService,
    TagsService,
  ],
  exports: [
    ShowcaseComponent
  ]
})

export class ShowcaseModule { }

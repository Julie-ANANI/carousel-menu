import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';

import { FooterModule } from '../common/footer/footer.module';
import { HeaderModule } from '../common/header/header.module';

import { UserComponent } from './user.component';

import { UserService } from '../../services/user/user.service';
import { InnovationService } from '../../services/innovation/innovation.service';
import { InnovationResolver } from '../../resolvers/innovation.resolver';
import { AutocompleteService } from '../../services/autocomplete/autocomplete.service';
import { ScrollService } from '../../services/scroll/scroll.service';
import { ShareService } from '../../services/share/share.service';
import { AnswerService } from '../../services/answer/answer.service';
import { InnovationCommonService } from '../../services/innovation/innovation-common.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    UserRoutingModule,
    FooterModule,
    HeaderModule
  ],
  declarations: [
    UserComponent,
  ],
  providers: [
    UserService,
    InnovationService,
    InnovationResolver,
    AutocompleteService,
    ScrollService,
    ShareService,
    AnswerService,
    InnovationCommonService
  ]
})

export class UserModule {}

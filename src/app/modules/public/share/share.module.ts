import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShareRoutingModule } from './share-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { ShareComponent } from './share.component';

import { HeaderUnauthModule } from '../../common/header-unauth/header-unauth.module';
import { SynthesisCompleteModule } from './component/synthesis-complete/synthesis-complete.module';
import { FooterModule } from '../../common/footer/footer.module';
import { HeaderModule } from '../../common/header/header.module';

import { UserService } from '../../../services/user/user.service';
import { InnovationService } from '../../../services/innovation/innovation.service';
import { AnswerService } from '../../../services/answer/answer.service';
import { ShareService } from '../../../services/share/share.service';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SynthesisCompleteModule,
    ShareRoutingModule,
    RouterModule,
    HeaderUnauthModule,
    FooterModule,
    HeaderModule
  ],
  declarations: [
    ShareComponent,
  ],
  providers: [
    UserService,
    InnovationService,
    AnswerService,
    ShareService
  ]
})

export class ShareModule {}

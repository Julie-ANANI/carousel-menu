import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';

import { FooterModule } from '../common/footer/footer.module';
import { HeaderModule } from '../common/header/header.module';

import { UserComponent } from './user.component';

import { InnovationResolver } from '../../resolvers/innovation.resolver';
import { ShareService } from '../../services/share/share.service';
import { AnswerService } from '../../services/answer/answer.service';
import { SpinnerLoaderModule } from '../utility-components/spinner-loader/spinner-loader.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    UserRoutingModule,
    FooterModule,
    HeaderModule,
    SpinnerLoaderModule
  ],
  declarations: [
    UserComponent,
  ],
  providers: [
    InnovationResolver,
    ShareService,
    AnswerService
  ]
})

export class UserModule {}

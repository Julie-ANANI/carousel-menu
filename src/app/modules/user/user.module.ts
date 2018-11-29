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

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    UserRoutingModule,
    FooterModule,
    HeaderModule,
  ],
  declarations: [
    UserComponent,
  ],
  providers: [
    UserService,
    InnovationService,
    InnovationResolver
  ]
})

export class UserModule {}

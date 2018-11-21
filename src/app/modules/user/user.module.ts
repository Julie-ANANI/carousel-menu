import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';

import { FooterModule } from '../common/footer/footer.module';
import { HeaderModule } from '../common/header/header.module';
import { SharedLoaderModule } from '../shared/components/shared-loader/shared-loader.module';

import { UserService } from '../../services/user/user.service';

import { UserComponent } from './user.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    UserRoutingModule,
    FooterModule,
    HeaderModule,
    SharedLoaderModule
  ],
  declarations: [
    UserComponent,
  ],
  providers: [
    UserService
  ]
})

export class UserModule {}

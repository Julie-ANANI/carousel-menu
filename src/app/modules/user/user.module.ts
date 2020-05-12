import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';

import { FooterModule } from '../common/footer/footer.module';
import { HeaderModule } from '../common/header/header.module';

import { UserComponent } from './user.component';

import { ShareService } from '../../services/share/share.service';
import { SpinnerLoaderModule } from '../utility/spinner-loader/spinner-loader.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    UserRoutingModule,
    FooterModule,
    HeaderModule,
    SpinnerLoaderModule,
  ],
  declarations: [
    UserComponent,
  ],
  providers: [
    ShareService,
  ]
})

export class UserModule {}

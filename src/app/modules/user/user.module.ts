import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';
import { FooterModule } from '../common/footer/footer.module';
import { HeaderModule } from '../common/header/header.module';
import { UserComponent } from './user.component';
import { SpinnerLoaderModule } from '../utility/spinner-loader/spinner-loader.module';
import { BannerModule } from '../utility/banner/banner.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    UserRoutingModule,
    FooterModule,
    HeaderModule,
    SpinnerLoaderModule,
    BannerModule,
  ],
  declarations: [
    UserComponent,
  ]
})

export class UserModule {}

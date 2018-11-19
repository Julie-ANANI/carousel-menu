import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PrivateComponent } from './private.component';
import { PrivateRoutingModule } from './private-routing.module';
import { FooterModule } from '../common/footer/footer.module';
import { HeaderModule } from '../common/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    PrivateRoutingModule,
    FooterModule,
    HeaderModule
  ],
  declarations: [
    PrivateComponent
  ],
  providers: [
    PrivateComponent
  ]
})

export class PrivateModule {}

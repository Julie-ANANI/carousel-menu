import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShareRoutingModule } from './share-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { ShareComponent } from './share.component';

import { HeaderUnauthModule } from '../../common/header-unauth/header-unauth.module';
import { SynthesisCompleteModule } from './component/synthesis-complete/synthesis-complete.module';
import { FooterModule } from '../../common/footer/footer.module';
import {HeaderModule} from '../../common/header/header.module';

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
})

export class ShareModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SynthesisCompleteModule } from './component/synthesis-complete/synthesis-complete.module';
import { ShareComponent } from './share.component';
import { RouterModule } from '@angular/router';
import { ShareRoutingModule } from './share-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NotFoundPageModule } from '../base/components/not-found-page/not-found-page.module';
import { SynthesisListModule } from './component/synthesis-list/synthesis-list.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SynthesisCompleteModule,
    ShareRoutingModule,
    RouterModule,
    NotFoundPageModule,
    SynthesisListModule
  ],
  declarations: [
    ShareComponent,
  ]
})

export class ShareModule {}

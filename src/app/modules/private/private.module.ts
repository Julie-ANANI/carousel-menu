import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PrivateComponent } from './private.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    PrivateComponent
  ],
  providers: [
    PrivateComponent
  ]
})

export class PrivateModule {}

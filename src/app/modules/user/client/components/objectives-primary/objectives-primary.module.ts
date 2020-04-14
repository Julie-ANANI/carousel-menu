import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ObjectivesPrimaryComponent } from './objectives-primary.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [
    ObjectivesPrimaryComponent
  ],
  exports: [
    ObjectivesPrimaryComponent
  ]
})

export class ObjectivesPrimaryModule {}

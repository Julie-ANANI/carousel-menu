import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ObjectivesSecondaryComponent } from './objectives-secondary.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FormsModule,
  ],
  declarations: [
    ObjectivesSecondaryComponent
  ],
  exports: [
    ObjectivesSecondaryComponent
  ]
})

export class ObjectivesSecondaryModule {}

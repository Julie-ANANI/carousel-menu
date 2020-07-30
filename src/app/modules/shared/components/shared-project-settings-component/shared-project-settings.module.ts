import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProjectSettingsComponent} from './shared-project-settings.component';

import { PipeModule } from '../../../../pipe/pipe.module';
import { SharedWorldmapModule } from '../shared-worldmap/shared-worldmap.module';
import { AutoCompleteInputModule } from '../../../utility/auto-complete-input/auto-complete-input.module';
import { InputListModule } from '../../../utility/input-list/input-list.module';
import { MessageTemplateModule } from '../../../utility/messages/message-template/message-template.module';
import { SharedTargetingWorldModule } from '../shared-targeting-world/shared-targeting-world.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forChild(),
    PipeModule,
    SharedWorldmapModule,
    AutoCompleteInputModule,
    InputListModule,
    MessageTemplateModule,
    SharedTargetingWorldModule,
  ],
  declarations: [
    SharedProjectSettingsComponent
  ],
  exports: [
    SharedProjectSettingsComponent
  ]
})

export class SharedProjectSettingsModule { }

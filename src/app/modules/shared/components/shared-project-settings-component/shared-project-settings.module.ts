import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { SharedProjectSettingsComponent} from './shared-project-settings.component';

import { PipeModule } from '../../../../pipe/pipe.module';
import { SharedWorldmapModule } from '../shared-worldmap/shared-worldmap.module';
import { AutocompleteInputModule } from '../../../utility-components/autocomplete-input/autocomplete-input.module';
import { InputListModule } from '../../../utility-components/input-list/input-list.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forChild(),
    PipeModule,
    SharedWorldmapModule,
    AutocompleteInputModule,
    InputListModule
  ],
  declarations: [
    SharedProjectSettingsComponent
  ],
  exports: [
    SharedProjectSettingsComponent
  ]
})

export class SharedProjectSettingsModule { }

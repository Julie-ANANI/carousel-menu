// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {SharedProsListModule} from '../shared-pros-list/shared-pros-list.module';

// Components
import {SharedSearchResultsComponent} from './shared-search-results.component';
import {SharedProsListOldModule} from '../shared-pros-list-old/shared-pros-list-old.module';
import {InputModule} from '../../../input/input.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    SharedProsListOldModule
  ],
  declarations: [
    SharedSearchResultsComponent
  ],
  exports: [
    SharedSearchResultsComponent
  ]
})

export class SharedSearchResultsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {SharedSearchSettingsComponent} from './shared-search-settings.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
   SharedSearchSettingsComponent
  ],
  exports: [
    SharedSearchSettingsComponent
  ]
})

export class SharedSearchSettingsModule {}

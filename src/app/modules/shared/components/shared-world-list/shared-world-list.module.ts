import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedWorldListComponent } from './shared-world-list.component';
import {TranslateModule} from '@ngx-translate/core';
import {SharedToggleListModule} from '../shared-toggle-list/shared-toggle-list.module';

@NgModule({
  declarations: [SharedWorldListComponent],
  exports: [
    SharedWorldListComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    SharedToggleListModule
  ]
})
export class SharedWorldListModule { }

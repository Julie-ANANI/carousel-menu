import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedWorldListComponent } from './shared-world-list.component';
import {TranslateModule} from '@ngx-translate/core';
import {SharedToggleListModule} from '../shared-toggle-list/shared-toggle-list.module';
import {PipeModule} from '../../../../pipe/pipe.module';

@NgModule({
  declarations: [SharedWorldListComponent],
  exports: [
    SharedWorldListComponent
  ],
    imports: [
        CommonModule,
        TranslateModule,
        SharedToggleListModule,
        PipeModule
    ]
})
export class SharedWorldListModule { }

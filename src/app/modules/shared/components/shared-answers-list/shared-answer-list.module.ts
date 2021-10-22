// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { SharedAnswersListComponent } from './shared-answers-list.component';
import {TableModule} from '../../../table/table.module';
import { TableComponentsModule } from "@umius/umi-common-component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        TableModule,
        TranslateModule.forChild(),
        TableComponentsModule
    ],
  declarations: [
    SharedAnswersListComponent
  ],
  exports: [
    SharedAnswersListComponent
  ]
})

export class SharedAnswerListModule { }

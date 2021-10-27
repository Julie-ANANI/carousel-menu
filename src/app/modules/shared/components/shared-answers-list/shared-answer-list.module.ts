// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import { SharedAnswersListComponent } from './shared-answers-list.component';
import { TableComponentsModule } from '@umius/umi-common-component/table';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
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

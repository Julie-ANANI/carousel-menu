import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AdminProjectsComponent } from './admin-projects.component';

import { PipeModule } from '../../../../../pipe/pipe.module';
import { TableModule } from '../../../../table/table.module';
import { AdminBatchesDisplayModule } from '../admin-batches-display/admin-batches-display.module';
import { MessageErrorModule } from '../../../../utility/messages/message-error/message-error.module';
import { AdminProjectsRoutingModule } from './admin-projects-routing.module';
import { AdminProjectModule } from '../admin-project/admin-project.module';
import { TableComponentsModule } from '@umius/umi-common-component/src/lib/components/table';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TableModule,
        RouterModule,
        TranslateModule.forChild(),
        PipeModule,
        RouterModule,
        AdminBatchesDisplayModule,
        MessageErrorModule,
        AdminProjectsRoutingModule,
        AdminProjectModule,
        TableComponentsModule
    ],
  declarations: [
    AdminProjectsComponent
  ],
  exports: [
    AdminProjectsComponent
  ]
})

export class AdminProjectsModule { }

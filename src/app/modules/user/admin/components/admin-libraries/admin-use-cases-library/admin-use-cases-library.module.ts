import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {AdminUseCasesLibraryComponent} from './admin-use-cases-library.component';
import {MessageErrorModule} from '../../../../../utility/messages/message-error/message-error.module';
import {TableModule} from '../../../../../table/table.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    MessageErrorModule,
    TableModule,
  ],
  declarations: [
    AdminUseCasesLibraryComponent,
  ],
  exports: [
    AdminUseCasesLibraryComponent,
  ]
})

export class AdminUseCasesLibraryModule {}

// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedProsListModule } from '../../../../shared/components/shared-pros-list/shared-pros-list.module';
import { PipeModule } from '../../../../../pipe/pipe.module';

// Components
import {AdminProfessionalsComponent} from './admin-professionals.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild(),
    PipeModule
  ],
  declarations: [
    AdminProfessionalsComponent
  ],
  exports: [
    AdminProfessionalsComponent
  ]
})

export class AdminProfessionalsModule { }

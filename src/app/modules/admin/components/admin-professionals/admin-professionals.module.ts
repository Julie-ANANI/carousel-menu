// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// Components
import {AdminProfessionalsComponent} from './admin-professionals.component';
import {SharedProsListModule} from '../../../shared/components/shared-pros-list/pros-list.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedProsListModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminProfessionalsComponent
  ],
  exports: [
    AdminProfessionalsComponent
  ]
})

export class AdminProfessionalsModule { }

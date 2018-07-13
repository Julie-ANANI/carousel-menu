// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedTextZoneModule } from '../shared-text-zone/shared-text-zone.module';

// Components
import { SharedEditEmail } from './shared-edit-email.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedTextZoneModule,
    FormsModule,
    TranslateModule.forChild()
  ],
  declarations: [
    SharedEditEmail
  ],
  exports: [
    SharedEditEmail
  ]
})

export class SharedEditEmailModule { }

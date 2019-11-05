import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MissionFormComponent } from './mission-form.component';

import { SidebarModule } from '../../sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    SidebarModule,
  ],
  declarations: [
    MissionFormComponent
  ],
  exports: [
    MissionFormComponent
  ]
})

export class MissionFormModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AdminPresetsComponent } from './admin-presets.component';
import { AdminPresetsEditComponent } from './admin-presets-edit/admin-presets-edit.component';
import { AdminPresetsListComponent } from './admin-presets-list/admin-presets-list.component';
import { AdminPresetsNewComponent } from './admin-presets-new/admin-presets-new.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminPresetsComponent,
    AdminPresetsEditComponent,
    AdminPresetsListComponent,
    AdminPresetsNewComponent
  ],
  exports: [
    AdminPresetsComponent
  ]
})

export class AdminPresetsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedEditScenarioModule } from '../../../../shared/components/shared-edit-scenario/shared-edit-scenario.module';

import { AdminEmailTemplatesComponent } from './admin-emails-templates.component';
import { AdminNewScenarioComponent } from './admin-new-scenario/admin-new-scenario.component';
import { AdminEditScenarioComponent } from './admin-edit-scenario/admin-edit-scenario.component';
import { AdminEditSignatureComponent } from './admin-edit-signature/admin-edit-signature.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedEditScenarioModule,
    TranslateModule.forChild()
  ],
  declarations: [
    AdminEmailTemplatesComponent,
    AdminNewScenarioComponent,
    AdminEditScenarioComponent,
    AdminEditSignatureComponent
  ],
  exports: [
    AdminEmailTemplatesComponent
  ]
})

export class AdminEmailsTemplatesModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SynthesisCompleteModule } from './component/synthesis-complete/synthesis-complete.module';
import { ShareComponent } from './share.component';
import { RouterModule } from '@angular/router';
import { ShareRoutingModule } from './share-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SynthesisListModule } from '../user/client/components/synthesis-list/synthesis-list.module';
import { SidebarModule } from '../sidebar/sidebar.module';
import { SidebarUserFormModule } from '../sidebar/components/user-form/sidebar-user-form.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderModule } from '../base/components/header/header.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SynthesisCompleteModule,
    ShareRoutingModule,
    RouterModule,
    SynthesisListModule,
    SidebarModule,
    SidebarUserFormModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderModule
  ],
  declarations: [
    ShareComponent,
  ]
})

export class ShareModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SynthesisCompleteModule } from './component/synthesis-complete/synthesis-complete.module';
import { ShareComponent } from './share.component';
import { RouterModule } from '@angular/router';
import { ShareRoutingModule } from './share-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NotFoundPageModule } from '../base/components/not-found-page/not-found-page.module';
import { SynthesisListModule } from '../client/components/synthesis-list/synthesis-list.module';
import { FooterModule } from '../base/components/footer/footer.module';
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
    NotFoundPageModule,
    SynthesisListModule,
    FooterModule,
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

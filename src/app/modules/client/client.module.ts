import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageModule } from 'angular-2-local-storage'; // TODO utiliser le localStorage pour accélérer les chargements
import { NgPipesModule } from 'ngx-pipes';
import { SharedModule } from '../shared/shared.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientFooterComponent } from './components/client-footer/client-footer.component';
import { ClientComponent } from './client.component';
import { ClientMyAccountComponent } from './components/client-my-account/client-my-account.component';
import { ClientDiscoverComponent } from './components/client-discover/client-discover.component';

import { ClientProjectComponent } from './components/client-project/client-project.component';
import { ClientCampaignComponent } from './components/client-campaign/client-campaign.component';
import { ClientUserComponent } from './components/client-user/client-user.component';
import { ClientMyProjectsComponent } from './components/client-my-projects/client-my-projects.component';

import { ClientLoginComponent } from './components/client-login/client-login.component';
import { ClientSignupComponent } from './components/client-signup/client-signup.component';
import { ClientLogoutComponent } from './components/client-logout/client-logout.component';
import { ClientProjectEditComponent } from './components/client-project-edit/client-project-edit.component';
import { ClientProjectNewComponent } from './components/client-project-new/client-project-new.component';
import { ClientProjectSynthesisComponent } from './components/client-project-synthesis/client-project-synthesis.component';
import { ClientProjectEditExample2Component } from './components/client-project-edit/client-project-edit-example2/client-project-edit-example2.component';
import { ClientProjectEditExample1Component } from './components/client-project-edit/client-project-edit-example1/client-project-edit-example1.component';


@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule,
    TranslateModule.forChild(),
    LocalStorageModule.withConfig({
      prefix: 'umi',
      storageType: 'localStorage'
    }),
    NgPipesModule,
    SharedModule
  ],
  declarations: [
    ClientComponent,
    ClientFooterComponent,
    ClientMyAccountComponent,

    ClientMyProjectsComponent,
    ClientProjectEditComponent,
    ClientProjectComponent,
    ClientCampaignComponent,
    ClientUserComponent,

    ClientDiscoverComponent,
    ClientLoginComponent,
    ClientSignupComponent,
    ClientLogoutComponent,
    ClientProjectNewComponent,
    ClientProjectSynthesisComponent,
    ClientProjectEditExample2Component,
    ClientProjectEditExample1Component
  ]
})
export class ClientModule {
}

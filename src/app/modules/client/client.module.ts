import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageModule } from 'angular-2-local-storage'; // TODO utiliser le localStorage pour accélérer les chargements
import { NgPipesModule } from 'ngx-pipes';
import { SharedModule } from '../shared/shared.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientHeaderComponent } from './components/layout/client-header/client-header.component';
import { ClientFooterComponent } from './components/layout/client-footer/client-footer.component';
import { ClientComponent } from './client.component';
import { ClientMyAccountComponent } from './components/client-my-account/client-my-account.component';
import { ClientDiscoverComponent } from './components/client-discover/client-discover.component';

import { ClientProjectComponent } from './components/client-project/client-project.component';
import { ClientCampaignComponent } from './components/client-campaign/client-campaign.component';
import { ClientUserComponent } from './components/client-user/client-user.component';
import { ClientMyProjectsComponent } from './components/client-my-projects/client-my-projects.component';

import { ClientLoginComponent } from './components/layout/client-login/client-login.component';
import { ClientSignupComponent } from './components/layout/client-signup/client-signup.component';
import { ClientLogoutComponent } from './components/layout/client-logout/client-logout.component';
import { ClientProjectEditComponent } from './components/client-project-edit/client-project-edit.component';
import { ClientProjectNewComponent } from './components/client-project-new/client-project-new.component';


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
    ClientHeaderComponent,
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
    ClientProjectNewComponent
  ]
})
export class ClientModule {
}

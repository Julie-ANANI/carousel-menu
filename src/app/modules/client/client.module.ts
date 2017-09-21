import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageModule } from 'angular-2-local-storage'; // TODO utiliser le localStorage pour accélérer les chargements
import { NgPipesModule } from 'ngx-pipes';
import { SharedModule } from '../shared/shared.module';
import { ClientRoutingModule } from './client-routing.module';
import { ClientHeaderComponent } from './components/client-header/client-header.component';
import { ClientFooterComponent } from './components/client-footer/client-footer.component';
import { ClientComponent } from './client.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { ClientAccountSidenavComponent } from './components/client-account-sidenav/client-account-sidenav.component';
import { ClientAccountComponent } from './components/client-account/client-account.component';
import { ClientDiscoverComponent } from './components/client-discover/client-discover.component';

import { ClientInnovationComponent } from './components/client-innovation/client-innovation.component';
import { ClientCampaignComponent } from './components/client-campaign/client-campaign.component';
import { ClientUserComponent } from './components/client-user/client-user.component';
import { ClientInnovationsComponent } from './components/client-innovations/client-innovations.component';

import { ClientLoginComponent } from './components/client-login/client-login.component';
import { ClientSignupComponent } from './components/client-signup/client-signup.component';
import { ClientLogoutComponent } from './components/client-logout/client-logout.component';
import { ClientInnovationSettingsComponent } from './components/client-innovation-settings/client-innovation-settings.component';


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
    ClientAccountComponent,
    ClientAccountSidenavComponent,
    ClientDashboardComponent,

    ClientInnovationsComponent,
    ClientInnovationSettingsComponent,
    ClientInnovationComponent,
    ClientCampaignComponent,
    ClientUserComponent,

    ClientDiscoverComponent,
    ClientLoginComponent,
    ClientSignupComponent,
    ClientLogoutComponent
  ]
})
export class ClientModule {
}

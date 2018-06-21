import { Routes } from '@angular/router';
import { AdminProjectDetailsComponent } from './admin-project-details/admin-project-details.component';
import { AdminProjectCardsComponent } from './admin-project-cards/admin-project-cards.component';
import { AdminProjectCampaignsComponent } from './admin-project-campaigns/admin-project-campaigns.component';
import { AdminProjectSynthesisComponent } from './admin-project-synthesis/admin-project-synthesis.component';

export const projectRoutes: Routes = [
  { path: '', redirectTo: 'cards', pathMatch: 'full'},
  { path: 'settings', component: AdminProjectDetailsComponent, pathMatch: 'full'},
  { path: 'cards', component: AdminProjectCardsComponent, pathMatch: 'full'},
  { path: 'synthesis', component: AdminProjectSynthesisComponent, pathMatch: 'full'},
  { path: 'campaigns', component: AdminProjectCampaignsComponent, pathMatch: 'full'}
];

import { Routes } from '@angular/router';
import { AdminProjectCardsComponent } from './admin-project-cards/admin-project-cards.component';
import { AdminProjectCampaignsComponent } from './admin-project-campaigns/admin-project-campaigns.component';
import { AdminProjectSynthesisComponent } from './admin-project-synthesis/admin-project-synthesis.component';
import { AdminProjectTagsPoolComponent } from './admin-project-tags-pool/admin-project-tags-pool.component';
import {AdminProjectQuestionnaireComponent} from './admin-project-questionnaire/admin-project-questionnaire.component';
import {AdminProjectManagementComponent} from './admin-project-management/admin-project-management.component';

export const projectRoutes: Routes = [
  { path: '', redirectTo: 'settings', pathMatch: 'full'},
  { path: 'settings', component: AdminProjectManagementComponent, pathMatch: 'full'},
  { path: 'cards', component: AdminProjectCardsComponent, pathMatch: 'full'},
  { path: 'synthesis', component: AdminProjectSynthesisComponent, pathMatch: 'full'},
  { path: 'campaigns', component: AdminProjectCampaignsComponent, pathMatch: 'full'},
  { path: 'tags', component: AdminProjectTagsPoolComponent, pathMatch: 'full'},
  { path: 'questionnaire', component: AdminProjectQuestionnaireComponent, pathMatch: 'full'}
];

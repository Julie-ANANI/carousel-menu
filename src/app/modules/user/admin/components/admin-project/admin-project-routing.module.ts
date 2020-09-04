import { Routes } from '@angular/router';

import { AdminProjectCampaignsComponent } from './admin-project-campaigns/admin-project-campaigns.component';
// import { AdminProjectSynthesisComponent } from './admin-project-synthesis/admin-project-synthesis.component';
// import { AdminProjectTagsPoolComponent } from './admin-project-tags-pool/admin-project-tags-pool.component';
// import { AdminProjectQuestionnaireComponent } from './admin-project-questionnaire/admin-project-questionnaire.component';
// import { AdminProjectManagementComponent } from './admin-project-management/admin-project-management.component';
import { AdminProjectFollowUpComponent } from './admin-project-follow-up/admin-project-follow-up.component';
import { AdminProjectPreparationComponent } from './admin-project-preparation/admin-project-preparation.component';

// import { AdminRoleGuard } from '../../../../../guards/admin-role-guard.service';

export const projectRoutes: Routes = [
  {
    path: 'preparation',
    component: AdminProjectPreparationComponent,
    children: [
      {
        path: 'description',
        pathMatch: 'full',
      },
      {
        path: 'questionnaire',
        /*component: AdminProjectQuestionnaireComponent,*/
        pathMatch: 'full',
      },
      {
        path: 'targeting',
        pathMatch: 'full',
      },
      {
        path: 'campaigns',
        component: AdminProjectCampaignsComponent,
        pathMatch: 'full',
      }
    ]
  },
  {
    path: 'follow-up',
    component: AdminProjectFollowUpComponent,
    pathMatch: 'full'
  }
];

/*export const projectRoutes: Routes = [
  // { path: '', redirectTo: 'settings', pathMatch: 'full'},
  {
    path: 'settings',
    component: AdminProjectManagementComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['projects', 'project', 'settings'] }
  },
  {
    path: 'synthesis',
    component: AdminProjectSynthesisComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['projects', 'project', 'synthesis'] }
  },
  {
    path: 'campaigns',
    component: AdminProjectCampaignsComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['projects', 'project', 'campaigns'] }
  },
  {
    path: 'answer_tags',
    component: AdminProjectTagsPoolComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['projects', 'project', 'answerTags'] }
  },
  {
    path: 'questionnaire',
    component: AdminProjectQuestionnaireComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['projects', 'project', 'questionnaire'] }
  },
  {
    path: 'follow-up',
    component: AdminProjectFollowUpComponent,
    pathMatch: 'full',
    canActivate: [AdminRoleGuard],
    data: { accessPath: ['projects', 'project', 'followUp'] }
  }
];*/

import { Routes } from '@angular/router';

import { AdminProjectCampaignsComponent } from './admin-project-campaigns/admin-project-campaigns.component';
import { AdminProjectQuestionnaireComponent } from './admin-project-questionnaire/admin-project-questionnaire.component';
import { AdminProjectFollowUpComponent } from './admin-project-follow-up/admin-project-follow-up.component';
import { AdminProjectPreparationComponent } from './admin-project-preparation/admin-project-preparation.component';
import { AdminProjectTargetingComponent } from './admin-project-targeting/admin-project-targeting.component';
import { AdminProjectDescriptionComponent } from './admin-project-description/admin-project-description.component';
import { AdminProjectAnalysisComponent } from './admin-project-analysis/admin-project-analysis.component';
import { AdminProjectSynthesisComponent } from './admin-project-synthesis/admin-project-synthesis.component';
// import { AdminProjectTagsPoolComponent } from './admin-project-tags-pool/admin-project-tags-pool.component';
// import { AdminProjectStoryboardComponent } from '../admin-project-storyboard/admin-project-storyboard.component';

import { campaignRoutes } from '../admin-campaigns/admin-campaigns-routing.module';

import { CampaignResolver } from '../../../../../resolvers/campaign.resolver';

// import { AdminRoleGuard } from '../../../../../guards/admin-role-guard.service';

export const projectRoutes: Routes = [
  {
    path: 'preparation',
    component: AdminProjectPreparationComponent,
    children: [
      {
        path: 'description',
        component: AdminProjectDescriptionComponent,
        pathMatch: 'full',
      },
      {
        path: 'questionnaire',
        component: AdminProjectQuestionnaireComponent,
        pathMatch: 'full',
      },
      {
        path: 'targeting',
        component: AdminProjectTargetingComponent,
        pathMatch: 'full',
      },
      {
        path: 'campaigns',
        component: AdminProjectCampaignsComponent,
        pathMatch: 'full',
      },
      {
        path: 'campaigns/campaign/:campaignId',
        resolve: { campaign : CampaignResolver },
        runGuardsAndResolvers: 'always',
        children: [
          ...campaignRoutes
        ]
      }
    ]
  },
  {
    path: 'analysis',
    component: AdminProjectAnalysisComponent,
    children: [
      {
        path: 'synthesis',
        component: AdminProjectSynthesisComponent,
        pathMatch: 'full',
      },
      // {
      //   path: 'answer-tags',
      //   component: AdminProjectTagsPoolComponent,
      //   pathMatch: 'full',
      // },
      // {
      //   path: 'storyboard',
      //   component: AdminProjectStoryboardComponent,
      //   pathMatch: 'full',
      // }
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

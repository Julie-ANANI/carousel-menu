import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminProjectCampaignsComponent } from './admin-project-campaigns/admin-project-campaigns.component';
import { AdminProjectQuestionnaireComponent } from './admin-project-questionnaire/admin-project-questionnaire.component';
import { AdminProjectFollowUpComponent } from './admin-project-follow-up/admin-project-follow-up.component';
import { AdminProjectPreparationComponent } from './admin-project-preparation/admin-project-preparation.component';
import { AdminProjectTargetingComponent } from './admin-project-targeting/admin-project-targeting.component';
import { AdminProjectDescriptionComponent } from './admin-project-description/admin-project-description.component';
import { AdminProjectAnalysisComponent } from './admin-project-analysis/admin-project-analysis.component';
import { AdminProjectSynthesisComponent } from './admin-project-synthesis/admin-project-synthesis.component';
import { AdminProjectTagsPoolComponent } from './admin-project-tags-pool/admin-project-tags-pool.component';
import { AdminProjectStoryboardComponent } from './admin-project-storyboard/admin-project-storyboard.component';
import { AdminProjectSettingsComponent } from './admin-project-settings/admin-project-settings.component';
import { AdminProjectCollectionComponent } from './admin-project-collection/admin-project-collection.component';
import { AdminProjectComponent } from './admin-project.component';

import { campaignRoutes } from '../admin-campaigns/admin-campaigns-routing.module';

import { CampaignResolver } from '../../../../../resolvers/campaign.resolver';

import { AdminRoleGuard } from '../../../../../guards/admin-role-guard.service';
import {AdminProjectStatisticsComponent} from './admin-project-statistics/admin-project-statistics.component';
import { CampaignListResolver } from "../../../../../resolvers/admin/campaign-list.resolver";

export const routes: Routes = [
  {
    path: '',
    component: AdminProjectComponent,
    children: [
      {
        path: 'settings',
        component: AdminProjectSettingsComponent,
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['projects', 'project', 'tabs', 'settings'] },
        pathMatch: 'full'
      },
      {
        path: 'preparation',
        component: AdminProjectPreparationComponent,
        canActivate: [AdminRoleGuard],
        resolve: { allCampaign : CampaignListResolver },
        data: { accessPath: ['projects', 'project', 'tabs', 'preparation'] },
        children: [
          {
            path: 'description',
            component: AdminProjectDescriptionComponent,
            pathMatch: 'full',
            canActivate: [AdminRoleGuard],
            data: { accessPath: ['projects', 'project', 'settings'] }
          },
          {
            path: 'questionnaire',
            component: AdminProjectQuestionnaireComponent,
            pathMatch: 'full',
            canActivate: [AdminRoleGuard],
            data: { accessPath: ['projects', 'project', 'questionnaire'] }
          },
          {
            path: 'targeting',
            component: AdminProjectTargetingComponent,
            pathMatch: 'full',
            canActivate: [AdminRoleGuard],
            data: { accessPath: ['projects', 'project', 'settings'] }
          },
          {
            path: 'campaigns',
            component: AdminProjectCampaignsComponent,
            pathMatch: 'full',
            canActivate: [AdminRoleGuard],
            data: { accessPath: ['projects', 'project', 'campaigns'] }
          },
          {
            path: 'statistics',
            component: AdminProjectStatisticsComponent,
            pathMatch: 'full',
            canActivate: [AdminRoleGuard],
            data: { accessPath: ['projects', 'project', 'statistics'] }
          },
          {
            path: 'campaigns/campaign/:campaignId',
            resolve: { campaign : CampaignResolver },
            runGuardsAndResolvers: 'always',
            canActivate: [AdminRoleGuard],
            data: { accessPath: ['projects', 'project', 'campaigns', 'campaign'] },
            children: [
              ...campaignRoutes
            ]
          }
        ]
      },
      {
        path: 'collection',
        component: AdminProjectCollectionComponent,
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['projects', 'project', 'tabs', 'collection'] },
        pathMatch: 'full',
      },
      {
        path: 'analysis',
        component: AdminProjectAnalysisComponent,
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['projects', 'project', 'tabs', 'analysis'] },
        children: [
          {
            path: 'synthesis',
            component: AdminProjectSynthesisComponent,
            pathMatch: 'full',
            canActivate: [AdminRoleGuard],
            data: { accessPath: ['projects', 'project', 'synthesis'] }
          },
          {
            path: 'answer-tags',
            component: AdminProjectTagsPoolComponent,
            pathMatch: 'full',
            canActivate: [AdminRoleGuard],
            data: { accessPath: ['projects', 'project', 'answerTags'] }
          },
          {
            path: 'storyboard',
            component: AdminProjectStoryboardComponent,
            pathMatch: 'full',
            canActivate: [AdminRoleGuard],
            data: { accessPath: ['projects', 'project', 'storyboard'] }
          }
        ]
      },
      {
        path: 'follow-up',
        component: AdminProjectFollowUpComponent,
        pathMatch: 'full',
        canActivate: [AdminRoleGuard],
        data: { accessPath: ['projects', 'project', 'tabs', 'followUp'] }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class AdminProjectRoutingModule {}

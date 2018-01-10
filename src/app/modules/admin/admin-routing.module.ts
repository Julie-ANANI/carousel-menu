import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminProjectsDetailsComponent } from './components/admin-projects/admin-project-details/admin-project-details.component';
import { AdminProjectsComponent } from './components/admin-projects/admin-projects.component';
import { AdminCampaignsComponent } from './components/admin-campaigns/admin-campaigns.component';
import { AdminEmailsComponent } from './components/admin-emails/admin-emails.component';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { AdminPatentsComponent } from './components/admin-patents/admin-patents.component';
import { AdminSearchesComponent } from './components/admin-searches/admin-searches.component';
import { AdminComponent } from './admin.component';
import { AdminAuthGuard } from './admin-auth-guard.service';
import { AdminBatchInformationComponent } from './components/admin-emails/admin-batch-information/admin-batch-information.component';
import { AdminUserDetailsComponent } from './components/admin-users/admin-user-detail/admin-user-details.component';
import { SharedNotFoundComponent } from '../shared/components/shared-not-found/shared-not-found.component';
import { AdminPresetsListComponent } from '../admin/components/admin-presets/admin-presets-list/admin-presets-list.component';
import { AdminSectionsListComponent } from '../admin/components/admin-presets/admin-sections-list/admin-sections-list.component';
import { AdminQuestionsListComponent } from '../admin/components/admin-presets/admin-questions-list/admin-questions-list.component';
import { AdminQuestionEditComponent } from '../admin/components/admin-presets/admin-question-edit/admin-question-edit.component';
import { AdminQuestionNewComponent } from '../admin/components/admin-presets/admin-question-new/admin-question-new.component';
import { AdminSectionNewComponent } from './components/admin-presets/admin-section-new/admin-section-new.component';
import { AdminSectionEditComponent } from './components/admin-presets/admin-section-edit/admin-section-edit.component';
import { AdminPresetNewComponent } from '../admin/components/admin-presets/admin-preset-new/admin-preset-new.component';
import { AdminPresetEditComponent } from '../admin/components/admin-presets/admin-preset-edit/admin-preset-edit.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
        pathMatch: 'full'
      },
      {
        path: 'users',
        children: [
          { path: '', component: AdminUsersComponent, pathMatch: 'full' },
          { path: 'user/:userId', component: AdminUserDetailsComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'projects',
        children: [
          { path: '', component: AdminProjectsComponent, pathMatch: 'full' },
          { path: 'project/:projectId', component: AdminProjectsDetailsComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'campaigns',
        children: [
          { path: '', component: AdminCampaignsComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'searches',
        children: [
          { path: '', component: AdminSearchesComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'emails',
        children: [
          { path: '', component: AdminEmailsComponent, pathMatch: 'full' },
          { path: 'batch/:batchId', component: AdminBatchInformationComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'index',
        children: [
          { path: '', component: AdminIndexComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'patents',
        children: [
          { path: '', component: AdminPatentsComponent, pathMatch: 'full' }
        ]
      },
      {
        path: 'presets',
        children: [
          { path: '', component: AdminPresetsListComponent, pathMatch: 'full' },
          { path: 'new', component: AdminPresetNewComponent, pathMatch: 'full' },
          {
            path: ':presetId',
            children: [
              { path: 'edit', component: AdminPresetEditComponent, pathMatch: 'full' }

            ]
          }
        ]
      },
      {
        path: 'questions',
        children: [
          { path: '', component: AdminQuestionsListComponent, pathMatch: 'full' },
          { path: 'new', component: AdminQuestionNewComponent, pathMatch: 'full'},
          {
            path: ':questionId',
            children: [
              { path: 'edit', component: AdminQuestionEditComponent, pathMatch: 'full' }

            ]
          }
        ]
      },
      {
        path: 'sections',
        children: [
          { path: '', component: AdminSectionsListComponent, pathMatch: 'full' },
          { path: 'new', component: AdminSectionNewComponent, pathMatch: 'full'},
          {
            path: ':sectionId',
            children: [
              { path: 'edit', component: AdminSectionEditComponent, pathMatch: 'full' }

            ]
          }
        ]
      },
      {
        path: '**',
        component: SharedNotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AdminAuthGuard
  ]
})
export class AdminRoutingModule {}

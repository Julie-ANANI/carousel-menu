import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AdminCommunityMembersComponent } from "./admin-community-members/admin-community-members.component";
import { AdminCommunityResponsesComponent } from "./admin-community-answers/admin-community-responses.component";
import { AdminCommunityProjectsComponent } from "./admin-community-projects/admin-community-projects.component";
import { AdminCommunityComponent } from './admin-community.component';

import { AdminAuthGuard } from '../../../../../guards/admin-auth-guard.service';
import {AdminCommunityMemberComponent} from './admin-community-members/components/admin-community-member/admin-community-member.component';
import {ProfessionalResolver} from '../../../../../resolvers/professional.resolver';
import {TagsSectorResolver} from '../../../../../resolvers/tags-sector-resolver';
import {AdminCommunityProjectComponent} from './admin-community-projects/component/admin-community-project/admin-community-project.component';
import {InnovationResolver} from '../../../../../resolvers/innovation.resolver';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AdminCommunityComponent,
        canActivateChild: [AdminAuthGuard],
        children: [
          { path: '', redirectTo: 'projects', pathMatch: 'full' },
          { path: 'projects', component: AdminCommunityProjectsComponent, pathMatch: 'full' },
          { path: 'members', component: AdminCommunityMembersComponent, pathMatch: 'full' },
          { path: 'emailanswers', component: AdminCommunityResponsesComponent, pathMatch: 'full' },
        ],
      },

      {
        path: 'members/:memberId',
        component: AdminCommunityMemberComponent,
        resolve: { professional: ProfessionalResolver, tagsSector: TagsSectorResolver },
        runGuardsAndResolvers: 'always',
        pathMatch: 'full'
      },
      {
        path: 'projects/:projectId',
        component: AdminCommunityProjectComponent,
        resolve: { innovation: InnovationResolver },
        runGuardsAndResolvers: 'always',
        pathMatch: 'full'
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

export class AdminCommunityRoutingModule {}

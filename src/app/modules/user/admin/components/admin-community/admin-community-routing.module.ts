import { Routes } from '@angular/router';

import { AdminCommunityMembersComponent } from "./admin-community-members/admin-community-members.component";
import { AdminCommunityResponsesComponent } from "./admin-community-answers/admin-community-responses.component";
import { AdminCommunityProjectsComponent } from "./admin-community-projects/admin-community-projects.component";
import { AdminCommunityProjectComponent } from "./admin-community-projects/component/admin-community-project/admin-community-project.component";

import { InnovationResolver } from "../../../../../resolvers/innovation.resolver";

export const communityRoutes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  {
    path: 'projects',
    children: [
      { path: '', component: AdminCommunityProjectsComponent, pathMatch: 'full' },
      { path: 'project/:projectId', resolve: { innovation : InnovationResolver }, component: AdminCommunityProjectComponent }
    ]},
  { path: 'members', component: AdminCommunityMembersComponent, pathMatch: 'full' },
  { path: 'emailanswers', component: AdminCommunityResponsesComponent, pathMatch: 'full' }
];

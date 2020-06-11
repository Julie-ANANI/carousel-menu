import { Routes } from '@angular/router';

import { AdminCommunityMembersComponent } from "./admin-community-members/admin-community-members.component";
import { AdminCommunityResponsesComponent } from "./admin-community-answers/admin-community-responses.component";
import { AdminCommunityProjectsComponent } from "./admin-community-projects/admin-community-projects.component";

export const communityRoutes: Routes = [
  { path: '', redirectTo: 'projects', pathMatch: 'full' },
  { path: 'projects', component: AdminCommunityProjectsComponent, pathMatch: 'full' },
  { path: 'members', component: AdminCommunityMembersComponent, pathMatch: 'full' },
  { path: 'emailanswers', component: AdminCommunityResponsesComponent, pathMatch: 'full' },
];

import { Routes } from '@angular/router';
import { AdminCommunityMembersComponent } from "./admin-community-members/admin-community-members.component";
import { AdminCommunityResponsesComponent } from "./admin-community-answers/admin-community-responses.component";
/*import {AdminEmailBlacklistComponent} from './admin-email-blacklist/admin-email-blacklist.component';
import {AdminCountryManagementComponent} from './admin-country-management/admin-country-management.component';*/

export const communityRoutes: Routes = [
  { path: '', redirectTo: 'members', pathMatch: 'full'},
  { path: 'members', component: AdminCommunityMembersComponent, pathMatch: 'full' },
  { path: 'emailanswers', component: AdminCommunityResponsesComponent, pathMatch: 'full'}

];

//{ path: 'lab', component: AdminCountryManagementComponent, pathMatch: 'full'}

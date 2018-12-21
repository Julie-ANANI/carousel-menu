import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClientComponent } from './client.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { AccountComponent } from './components/account/account.component';


const clientRoutes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full'
      },
      {
        path: 'account',
        component: AccountComponent,
        pathMatch: 'full'
      },
      {
        path: 'projects',
        children: [
          { path: '', component: ProjectsListComponent, pathMatch: 'full' },
          { path: 'new', component: NewProjectComponent, pathMatch: 'full' },
          { path:  ':projectId', loadChildren: './components/project/project.module#ProjectModule' }
        ]
      },
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(clientRoutes)
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})

export class ClientRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { ClientComponent } from './client.component';
import { ProjectsListComponent } from './components/projects-list/projects-list.component';
import { NewProjectComponent } from './components/new-project/new-project.component';


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
        path: 'projects',
        children: [
          { path: '', component: ProjectsListComponent, pathMatch: 'full' },
          { path: 'new', component: NewProjectComponent, pathMatch: 'full' },
          { path:  ':id', loadChildren: './components/project/project.module#ProjectModule' }
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

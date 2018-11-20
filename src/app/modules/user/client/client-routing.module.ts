import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { ClientComponent } from './client.component';
import { ProjectComponent } from './components/project/project.component';


const clientRoutes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        redirectTo: 'projects'
      },
      {
        path: 'projects',
        children: [
          { path: '', component: ProjectComponent, pathMatch: 'full' },
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

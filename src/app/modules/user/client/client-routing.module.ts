import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { ClientComponent } from './client.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
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
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'projects',
        component: ProjectComponent,
        pathMatch: 'full'
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

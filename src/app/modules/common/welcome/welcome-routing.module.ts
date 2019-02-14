import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { WelcomeComponent } from './welcome.component';

const welcomeRoutes: Routes = [
  { path: '', component: WelcomeComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    RouterModule.forChild(welcomeRoutes)
  ],
  providers: [
  ],
  exports: [
    RouterModule
  ]
})

export class WelcomeRoutingModule {}

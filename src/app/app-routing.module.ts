import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { AdminModule } from './modules/admin/admin.module';
// import { ClientModule } from './modules/client/client.module';
// import { QuizModule } from './modules/quiz/quiz.module';
import { AuthService } from './services/auth/auth.service';
import { IndexService } from './services/index/index.service';
import { NonAuthGuard } from './non-auth-guard.service';
import { AuthGuard } from './auth-guard.service';

const appRoutes: Routes = [
  {
    path: 'quiz',
    loadChildren: './modules/quiz/quiz.module#QuizModule'
  },
  {
    path: 'admin',
   loadChildren: './modules/admin/admin.module#AdminModule'
  },
  {
    path: '',
    loadChildren: './modules/client/client.module#ClientModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [
  ],
  providers: [
    AuthGuard,
    NonAuthGuard,
    AuthService,
    IndexService
  ]
})
export class AppRoutingModule { }

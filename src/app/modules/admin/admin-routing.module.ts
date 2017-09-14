import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminUserComponent } from './components/admin-user/admin-user.component';
import { AdminQuizEditorComponent } from './components/admin-quiz-editor/admin-quiz-editor.component';
import { AdminComponent } from './admin.component';
import { AdminAuthGuard } from './admin-auth-guard.service';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/projects',
        component: AdminDashboardComponent
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            component: AdminUsersComponent
          },
          {
            path: ':userId',
            component: AdminUserComponent
          }
        ]
      },
      {
        path: 'quiz',
        children: [
          {
            path: '',
            redirectTo: '/admin/quiz/edit'
          },
          {
            path: 'edit',
            component: AdminQuizEditorComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AdminAuthGuard
  ]
})
export class AdminRoutingModule {}

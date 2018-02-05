import { Routes } from '@angular/router';

import { AdminSectionsComponent } from './admin-sections.component';
import { AdminSectionsEditComponent } from './admin-sections-edit/admin-sections-edit.component';
import { AdminSectionsListComponent } from './admin-sections-list/admin-sections-list.component';
import { AdminSectionsNewComponent } from './admin-sections-new/admin-sections-new.component';

export const sectionsRoutes: Routes = [
  {
    path: '',
    component: AdminSectionsComponent,
    children: [
      { path: '', component: AdminSectionsListComponent, pathMatch: 'full' },
      { path: 'new', component: AdminSectionsNewComponent, pathMatch: 'full' },
      { path: ':sectionId', component: AdminSectionsEditComponent, pathMatch: 'full' }
    ]
  }
];

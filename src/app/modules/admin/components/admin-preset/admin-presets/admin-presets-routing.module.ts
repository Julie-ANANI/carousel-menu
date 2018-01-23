import { Routes } from '@angular/router';

import { AdminPresetsComponent } from './admin-presets.component';
import { AdminPresetsEditComponent } from './admin-presets-edit/admin-presets-edit.component';
import { AdminPresetsListComponent } from './admin-presets-list/admin-presets-list.component';
import { AdminPresetsNewComponent } from './admin-presets-new/admin-presets-new.component';

export const presetsRoutes: Routes = [
  {
    path: '',
    component: AdminPresetsComponent,
    children: [
      { path: '', component: AdminPresetsListComponent, pathMatch: 'full' },
      { path: 'new', component: AdminPresetsNewComponent, pathMatch: 'full' },
      { path: ':presetId', component: AdminPresetsEditComponent, pathMatch: 'full' }
    ]
  }
];

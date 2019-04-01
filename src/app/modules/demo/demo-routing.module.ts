import { Routes } from '@angular/router';

export const demoRoutes: Routes = [
  {
    path: 'search-tool', loadChildren: './modules/demo/components/search-tool/search-tool.module#SearchToolModule'
  }
];


import { Routes } from '@angular/router';

export const demoRoutes: Routes = [
  {
    path: 'search-tool',
    loadChildren: () => import('../../modules/demo/components/search-tool/search-tool.module').then(m => m.SearchToolModule)
  },
  {
    path: 'showcase',
    loadChildren: () => import('../../modules/demo/components/showcase/showcase.module').then(m => m.ShowcaseModule)
  }
];


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocsCssGuardService } from '../../../guards/docs-css-guard.service';

import { DocsCssComponent } from './docs-css.component';
import { OverviewComponent } from './overview/overview.component';
import { AccordionsComponent } from './components/accordions/accordions.component';
import { TypographyComponent } from './elements/typography/typography.component';
import { TableComponent } from './elements/table/table.component';
import { ButtonComponent } from './elements/button/button.component';
import { LabelComponent } from './elements/label/label.component';
import { CodeComponent } from './elements/code/code.component';
import { MediaComponent } from './elements/media/media.component';
import { FormComponent } from './elements/form/form.component';
import { CloseComponent } from './elements/close/close.component';
import { IconComponent } from './elements/icon/icon.component';
import { ColorsComponent } from './utilities/colors/colors.component';
import { CursorsComponent } from './utilities/cursors/cursors.component';
import { DisplayComponent } from './utilities/display/display.component';
import { DividerComponent } from './utilities/divider/divider.component';
import { LoadingComponent } from './utilities/loading/loading.component';
import { MarginsComponent } from './utilities/margins/margins.component';

const docsCssRoutes: Routes = [
  {
    path: '',
    component: DocsCssComponent,
    canActivateChild: [DocsCssGuardService],
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: OverviewComponent,
        pathMatch: 'full'
      },
      {
        path: 'elements',
        redirectTo: 'elements/typography',
        pathMatch: 'full'
      },
      { path: 'elements/typography', component: TypographyComponent, pathMatch: 'full' },
      { path: 'elements/table', component: TableComponent, pathMatch: 'full' },
      { path: 'elements/labels', component: LabelComponent, pathMatch: 'full' },
      { path: 'elements/buttons', component: ButtonComponent, pathMatch: 'full' },
      { path: 'elements/code', component: CodeComponent, pathMatch: 'full' },
      { path: 'elements/media', component: MediaComponent, pathMatch: 'full' },
      { path: 'elements/form', component: FormComponent, pathMatch: 'full' },
      { path: 'elements/close', component: CloseComponent, pathMatch: 'full' },
      { path: 'elements/icons', component: IconComponent, pathMatch: 'full' },
      {
        path: 'components',
        redirectTo: 'components/accordions',
        pathMatch: 'full'
      },
      { path: 'components/accordions', component: AccordionsComponent, pathMatch: 'full' },
      {
        path: 'utilities',
        redirectTo: 'utilities/colors',
        pathMatch: 'full'
      },
      { path: 'utilities/colors', component: ColorsComponent, pathMatch: 'full' },
      { path: 'utilities/cursors', component: CursorsComponent, pathMatch: 'full' },
      { path: 'utilities/display', component: DisplayComponent, pathMatch: 'full' },
      { path: 'utilities/divider', component: DividerComponent, pathMatch: 'full' },
      { path: 'utilities/loading', component: LoadingComponent, pathMatch: 'full' },
      { path: 'utilities/margins', component: MarginsComponent, pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(docsCssRoutes)
  ],
  providers: [
    DocsCssGuardService
  ],
  exports: [
    RouterModule
  ]
})

export class DocsCssRoutingModule { }

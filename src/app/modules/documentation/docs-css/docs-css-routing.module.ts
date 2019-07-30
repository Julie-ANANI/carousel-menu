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
import { PaddingsComponent } from './utilities/paddings/paddings.component';
import { PositionsComponent } from './utilities/positions/positions.component';
import { RatingsComponent } from './utilities/ratings/ratings.component';
import { ShapeComponent } from './utilities/shape/shape.component';
import { TextComponent } from './utilities/text/text.component';
import { TitleComponent } from './utilities/title/title.component';
import { AvatarsComponent } from './components/avatars/avatars.component';
import { BadgesComponent } from './components/badges/badges.component';
import { BannersComponent } from './components/banners/banners.component';
import { BarsComponent } from './components/bars/bars.component';
import { CardsComponent } from './components/cards/cards.component';

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
      { path: 'components/avatars', component: AvatarsComponent, pathMatch: 'full' },
      { path: 'components/badges', component: BadgesComponent, pathMatch: 'full' },
      { path: 'components/banners', component: BannersComponent, pathMatch: 'full' },
      { path: 'components/bars', component: BarsComponent, pathMatch: 'full' },
      { path: 'components/cards', component: CardsComponent, pathMatch: 'full' },
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
      { path: 'utilities/margin', component: MarginsComponent, pathMatch: 'full' },
      { path: 'utilities/padding', component: PaddingsComponent, pathMatch: 'full' },
      { path: 'utilities/position', component: PositionsComponent, pathMatch: 'full' },
      { path: 'utilities/ratings', component: RatingsComponent, pathMatch: 'full' },
      { path: 'utilities/shape', component: ShapeComponent, pathMatch: 'full' },
      { path: 'utilities/text', component: TextComponent, pathMatch: 'full' },
      { path: 'utilities/title', component: TitleComponent, pathMatch: 'full' },
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

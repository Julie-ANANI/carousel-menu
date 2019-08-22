import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DocsCssRoutingModule } from './docs-css-routing.module';

import { DocsCssComponent } from './docs-css.component';
import { OverviewComponent } from './overview/overview.component';
import { AccordionsComponent } from './components/accordions/accordions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TypographyComponent } from './elements/typography/typography.component';
import { TableComponent } from './elements/table/table.component';
import { ButtonComponent } from './elements/button/button.component';
import { LabelComponent } from './elements/label/label.component';
import { CodeComponent } from './elements/code/code.component';
import { MediaComponent } from './elements/media/media.component';
import { FormComponent } from './elements/form/form.component';
import { CloseComponent } from './elements/close/close.component';
import { ColorsComponent } from './utilities/colors/colors.component';
import { CursorsComponent } from './utilities/cursors/cursors.component';
import { DisplayComponent } from './utilities/display/display.component';
import { DividerComponent } from './utilities/divider/divider.component';
import { IconComponent } from './elements/icon/icon.component';
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
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { MenuComponent } from './components/menu/menu.component';
import { ModalComponent } from './components/modal/modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    DocsCssRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    DocsCssComponent,
    OverviewComponent,
    TypographyComponent,
    TableComponent,
    LabelComponent,
    AccordionsComponent,
    ButtonComponent,
    CodeComponent,
    MediaComponent,
    FormComponent,
    CloseComponent,
    ColorsComponent,
    CursorsComponent,
    DisplayComponent,
    DividerComponent,
    IconComponent,
    LoadingComponent,
    MarginsComponent,
    PaddingsComponent,
    PositionsComponent,
    RatingsComponent,
    ShapeComponent,
    TextComponent,
    TitleComponent,
    AvatarsComponent,
    BadgesComponent,
    BannersComponent,
    BarsComponent,
    CardsComponent,
    DropdownComponent,
    MenuComponent,
    ModalComponent,
    NavbarComponent,
    PaginationComponent
  ],
})

export class DocsCssModule {
}


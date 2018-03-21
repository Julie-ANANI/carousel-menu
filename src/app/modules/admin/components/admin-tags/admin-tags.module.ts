/**
 * Created by juandavidcruzgomez on 20/03/2018.
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';

import { AdminTagsComponent } from './admin-tags.component';
import { AdminTagListComponent } from './admin-tag-list/admin-tag-list.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule.forChild()
    ],
    declarations: [
        AdminTagsComponent,
        AdminTagListComponent
    ],
    exports: [
        AdminTagsComponent,
        AdminTagListComponent
    ]
})

export class AdminSearchModule {}
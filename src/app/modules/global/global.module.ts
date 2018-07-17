import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


// Pipes
import { TranslateModule } from '@ngx-translate/core';
import { Angular2FontawesomeModule } from 'angular2-fontawesome';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        RouterModule.forChild([]), // giving no routes but needed for all <a [routerLink]=''> uses
        Angular2FontawesomeModule,
        Ng2AutoCompleteModule
    ],
    declarations: [
    ],
    exports: [
    ]
})

export class GlobalModule {}

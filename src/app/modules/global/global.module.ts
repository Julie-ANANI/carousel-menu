import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';

// Directives
import { InputListComponent } from '../../directives/input-list/input-list.component';
import { AutocompleteInputComponent } from '../../directives/autocomplete-input/autocomplete-input.component';
import { SearchInputComponent } from '../../directives/search-input/search-input.component';

//Pipes
import { DomSanitizerPipe } from '../../pipes/DomSanitizer';
import { FilterPipe } from '../../pipes/TableFilterPipe';
import { LimitsPipe } from '../../pipes/TableLimitsPipe';
import { CharacterCountdown } from '../../pipes/CharacterCountdown';
import { MultilingModule } from '../../pipes/multiling/multiling.module';
import { TranslateModule } from "@ngx-translate/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Angular2FontawesomeModule } from "angular2-fontawesome";
import { Ng2AutoCompleteModule } from "ng2-auto-complete";


@NgModule({
    imports: [
        CommonModule,
        MultilingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        RouterModule.forChild([]), // giving no routes but needed for all <a [routerLink]=''> uses
        Angular2FontawesomeModule,
        Ng2AutoCompleteModule
    ],
    declarations: [
        InputListComponent,
        AutocompleteInputComponent,
        SearchInputComponent,
        DomSanitizerPipe,
        FilterPipe,
        LimitsPipe,
        CharacterCountdown,
        DomSanitizerPipe
    ],
    exports: [
        InputListComponent,
        AutocompleteInputComponent,
        SearchInputComponent,
        FilterPipe,
        LimitsPipe,
        CharacterCountdown,
        DomSanitizerPipe
    ]
})

export class GlobalModule {}
import { NgModule } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AppModalSpinnerComponent } from './shared/components/common/app-modal-spinner/app-modal-spinner.component';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './shared/spinner/spinner.component'
import { TwoDecimalGlobalNumberFormatPipe } from './pipes/two-decimal-global-number-format-pipe.pipe';
import { GlobalNumberFormat } from './pipes/Global-Number-Format';

import {FormsModule} from '@angular/forms'
import {AutoCompleteModule} from 'primeng/autocomplete'
@NgModule({
    imports: [
        ProgressSpinnerModule,FormsModule,AutoCompleteModule,
        CommonModule
    ],
    declarations: [
        AppModalSpinnerComponent,
        SpinnerComponent,
        TwoDecimalGlobalNumberFormatPipe,
        GlobalNumberFormat
    ],
    exports: [
        CommonModule,
        ProgressSpinnerModule,
        AppModalSpinnerComponent,
        SpinnerComponent,
        TwoDecimalGlobalNumberFormatPipe,
        GlobalNumberFormat
    ]
})
export class AppSharedModule { }
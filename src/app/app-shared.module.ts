import { NgModule } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AppModalSpinnerComponent } from './shared/components/common/app-modal-spinner/app-modal-spinner.component';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './shared/spinner/spinner.component'
import { TwoDecimalGlobalNumberFormatPipe } from './pipes/two-decimal-global-number-format-pipe.pipe';
import { GlobalNumberFormat } from './pipes/Global-Number-Format';
import { FiveDecimalGlobalNumberFormatPipe } from './pipes/two-decimal-global-number-format-pipe.pipe';

@NgModule({ 
    imports: [
        ProgressSpinnerModule,
        CommonModule
    ],
    declarations: [
        AppModalSpinnerComponent,
        SpinnerComponent,
        TwoDecimalGlobalNumberFormatPipe,
        GlobalNumberFormat,
        FiveDecimalGlobalNumberFormatPipe
    ],
    exports: [
        CommonModule,
        ProgressSpinnerModule,
        AppModalSpinnerComponent,
        SpinnerComponent,
        TwoDecimalGlobalNumberFormatPipe,
        GlobalNumberFormat,
        FiveDecimalGlobalNumberFormatPipe
    ]
})
export class AppSharedModule { }
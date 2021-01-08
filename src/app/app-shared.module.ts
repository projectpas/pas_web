import { NgModule } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AppModalSpinnerComponent } from './shared/components/common/app-modal-spinner/app-modal-spinner.component';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './shared/spinner/spinner.component'
import { TwoDecimalGlobalNumberFormatPipe } from './pipes/two-decimal-global-number-format-pipe.pipe';
import { GlobalNumberFormat } from './pipes/Global-Number-Format';

@NgModule({
    imports: [
        ProgressSpinnerModule,
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
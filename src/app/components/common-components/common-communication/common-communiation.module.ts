import { NgModule } from '@angular/core';
import { MemoCommonComponent } from './common-memo/common-memo.component';
import { PhoneCommonComponent } from './common-phone/common-phone.component';
import { TextCommonComponent } from './common-text/common-text.component';
import { EmailCommonComponent } from './common-email/common-email.component';
import { CommonModule } from '@angular/common'; 
import { TableModule } from 'primeng/table';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatTooltipModule } from '@angular/material';
import { FileUploadModule } from 'primeng/fileupload';
import {EditorModule} from 'primeng/editor';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { CommonCommunicationComponent } from './communication.component';

@NgModule({
    declarations: [
        MemoCommonComponent,
        PhoneCommonComponent,
        TextCommonComponent,
        EmailCommonComponent,
        CommonCommunicationComponent
    ],
    imports: [CommonModule,
        TableModule,
        MatTooltipModule,
        FileUploadModule,
        NgMultiSelectDropDownModule,
        EditorModule,
        MultiSelectModule,
        FormsModule,
        AutoCompleteModule
    ],
    exports: [ 
        MemoCommonComponent,
        PhoneCommonComponent,
        TextCommonComponent,
        EmailCommonComponent,
        CommonCommunicationComponent
    ],
})
export class CommonCommunicationModule {
}
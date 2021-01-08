import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { TableModule } from 'primeng/table';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatTooltipModule } from '@angular/material';
import { FileUploadModule } from 'primeng/fileupload';
import {EditorModule} from 'primeng/editor';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { CommonDocumentsComponent } from './common-documents.component';



@NgModule({
    declarations: [
        CommonDocumentsComponent
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
        CommonDocumentsComponent
    ],
})
export class CommonDocumentsModule {
}
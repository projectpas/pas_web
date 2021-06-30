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
import { CommonPublicationViewComponent } from './common-publicationView.component';
import { CommonDocumentsModule } from '../common-documents/common-documents.module';



@NgModule({
    declarations: [
        CommonPublicationViewComponent
    ],
    imports: [CommonModule,
        TableModule,
        MatTooltipModule,
        FileUploadModule,
        NgMultiSelectDropDownModule,
        EditorModule,
        MultiSelectModule,
        FormsModule,
        AutoCompleteModule,
        CommonDocumentsModule,
    ],
    exports: [ 
        CommonPublicationViewComponent
    ],
})
export class CommonPublicationViewModule {
}
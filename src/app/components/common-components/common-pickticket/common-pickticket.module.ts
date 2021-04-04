import { SpinnerComponent } from './../../../shared/spinner/spinner.component';
import { CheckboxModule } from 'primeng/checkbox';
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
import { CommonPickticketComponent } from './common-pickticket.component';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    MatTooltipModule,
    FileUploadModule,
    NgMultiSelectDropDownModule,
    EditorModule,
    MultiSelectModule,
    FormsModule,
    AutoCompleteModule,
    CheckboxModule,
  ],
  exports: [ 
    CommonPickticketComponent,
],
  declarations: [CommonPickticketComponent]
})
export class CommonPickticketModule { }

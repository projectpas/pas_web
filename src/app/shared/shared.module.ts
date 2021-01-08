// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { NgModule } from "@angular/core";
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule } from "@ngx-translate/core";

import { QuickAppProMaterialModule } from "../modules/material.module";

import { PageHeaderComponent } from './page-header.component'
import { UserEditorComponent } from '../admin/user-editor.component';
import { AppDialogComponent } from './app-dialog.component';
import { TableModule } from 'primeng/table';

import { GroupByPipe } from '../pipes/group-by.pipe';
import { CommonModule } from "@angular/common";
import { CustomerPagesModule } from "../customerpages/customerpages.module";

@NgModule({
    imports: [
        FlexLayoutModule,
        FormsModule, ReactiveFormsModule,
        BrowserModule, BrowserAnimationsModule,
        QuickAppProMaterialModule,
        TranslateModule,
        CommonModule,
        CustomerPagesModule
    ],
    exports: [
        FlexLayoutModule,
        FormsModule, ReactiveFormsModule,
        BrowserModule, BrowserAnimationsModule,
        QuickAppProMaterialModule,
        TranslateModule,
        PageHeaderComponent,
        GroupByPipe,
        UserEditorComponent,
        AppDialogComponent,
        
        
        
    ],
    declarations: [
        PageHeaderComponent,
        GroupByPipe,
        UserEditorComponent,
        AppDialogComponent,
        
    ],
    entryComponents: [
        AppDialogComponent
    ]
})
export class SharedModule {

}
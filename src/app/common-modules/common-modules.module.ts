import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonModulesComponent } from './common-modules.component';
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from "primeng/autocomplete";
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditorModule } from 'primeng/editor';
import { AppSharedModule } from "../app-shared.module";
import { SalesQuoteService } from "../services/salesquote.service";
import { SalesQuoteEndpointService } from "../services/salesquote-endpoint.service";
import { AddressComponentComponent } from '../shared/components/address-component/address-component.component';
import { AllApprovalRuleComponent }  from "../shared/components/all-approval-rule/all-approval-rule.component";
import { AuditComponentComponent } from '../shared/components/audit-component/audit-component.component';

@NgModule({
  imports: [
    CommonModule,
        CommonModule,
        FlexLayoutModule,
        FormsModule, ReactiveFormsModule,
        TranslateModule,
        CommonModule,
        TableModule,
        ButtonModule,
        SelectButtonModule,
        InputTextModule,
        MultiSelectModule,
        InputSwitchModule,
        CheckboxModule,
        AutoCompleteModule,
        TabViewModule,
        MatTooltipModule,
        EditorModule,
        AppSharedModule
  ],
  declarations: [
    CommonModulesComponent,  
    AddressComponentComponent,
    AllApprovalRuleComponent,
    AuditComponentComponent
  ],
  exports:[
    AddressComponentComponent,
    AllApprovalRuleComponent,
    AuditComponentComponent
  ],
  providers: [ SalesQuoteService, SalesQuoteEndpointService],
})
export class CommonModulesModule { }

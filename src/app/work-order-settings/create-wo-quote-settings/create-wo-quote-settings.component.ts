import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
declare var $ : any;
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { MenuItem } from 'primeng/api';//bread crumb
import { Router } from '@angular/router';

import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { WorkOrderService } from '../../services/work-order/work-order.service';
import { WorkOrderType } from '../../models/work-order-type.model';
import { WorkOrderSettingsService } from '../../services/work-order-settings.service';
import { CommonService } from '../../services/common.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-create-wo-quote-settings',
    templateUrl: './create-wo-quote-settings.component.html',
    styleUrls: ['./create-wo-quote-settings.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})

export class CreateWOQuoteSettingsComponent implements OnInit {
    receivingForm: any = {
        "workOrderQuoteSettingId":0,
        "workOrderTypeId":0,
        "prefix":"",
        "sufix":"",
        "startCode":"",
        "validDays":0,
        "masterCompanyId":1,
        "createdBy":"admin",
        "updatedBy":"admin",
        "createdDate":new Date(),
        "updatedDate":new Date(),
        "isActive":true,
        "isDeleted":false,
        "isApprovalRule":false
        };
    isEditMode: boolean = false;
    disablesavebutton: boolean = true;
    private onDestroy$: Subject<void> = new Subject<void>();
    setEditArray:any=[]
    breadcrumbs: MenuItem[];
    workOrderTypes: WorkOrderType[];
    moduleName: string = "WO Quote Settings";    

    constructor(private router: Router,private authService: AuthService,
        private commonService: CommonService, private workOrderService: WorkOrderService, private alertService: AlertService, private receivingCustomerWorkOrderService: WorkOrderSettingsService){
    }

    ngOnInit() {
        this.getAllWorkOrderTypes();
        if(this.receivingCustomerWorkOrderService.isEditWOQuoteSettingsList){
            this.isEditMode = true;
            this.receivingForm = this.receivingCustomerWorkOrderService.woQuoteSettingsData;
            if(this.receivingForm.effectivedate)
            {
                this.receivingForm.effectivedate= new Date(this.receivingForm.effectivedate);
            }
        }
        if (!this.isEditMode) 
        {
            this.breadcrumbs = [
                { label: 'WO Quote Settings' },
                { label: 'Create WO Quote Settings' }
            ];
        }
        else
        {
            this.breadcrumbs = [
                { label: 'WO Quote Settings' },
                { label: 'Edit WO Quote Settings' }
            ];
        }
    }
   
    getAllWorkOrderTypes(): void {
        this.setEditArray = [];
        const strText ='';
        if(this.isEditMode==true){
            this.setEditArray.push(this.receivingForm.workOrderTypeId ? this.receivingForm.workOrderTypeId :0)
            if(this.setEditArray && this.setEditArray.length==0){
                this.setEditArray.push(0);  
            }
        }else{
            this.setEditArray.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('WorkOrderType', 'ID', 'Description', strText, true, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
      this.workOrderTypes = res.map(x => {
                return {
                    id: x.value,
                    description: x.label
                }
            });
        }) 
    }

    saveOrUpdateWOQuoteSetting(){
        this.workOrderService.saveOrUpdateWOQuoteSetting(this.receivingForm)
        .subscribe(
            (res)=>{
                this.alertService.showMessage(
                    this.moduleName,
                    `Setting ${(this.isEditMode)?'updated':'created'} successfully`,
                    MessageSeverity.success
                );
            this.router.navigateByUrl('/workordersettingsmodule/workordersettings/app-wo-quote-settings-list');
            },
            (err)=>{
                this.errorHandling(err);
            }
        )
    }

    enableHeaderSave()
    {
        if(this.receivingForm.isApprovalRule && this.receivingForm.effectivedate == null)
        {
            this.disablesavebutton =true;
        }
        else{
            this.disablesavebutton = false;
        }
    }
    
    errorHandling(err){
        if(err['error']['errors']){
            err['error']['errors'].forEach(x=>{
                this.alertService.showMessage(
                    this.moduleName,
                    x['message'],
                    MessageSeverity.error
                );
            })
        }
        else{
            this.alertService.showMessage(
                this.moduleName,
                'Saving data Failed due to some input error',
                MessageSeverity.error
            );
        }
    }
}
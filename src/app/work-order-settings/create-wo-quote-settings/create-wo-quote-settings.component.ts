import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import * as $ from 'jquery';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { ItemMasterService } from '../../services/itemMaster.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuItem } from 'primeng/api';//bread crumb
import { Charge } from '../../models/charge.model';
import { MasterCompany } from '../../models/mastercompany.model';
import { AuditHistory } from '../../models/audithistory.model';
import { AuthService } from '../../services/auth.service';
import { ReceivingCustomerWorkService } from '../../services/receivingcustomerwork.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { CustomerService } from '../../services/customer.service';
import { Condition } from '../../models/condition.model';
import { ConditionService } from '../../services/condition.service';
import { VendorService } from '../../services/vendor.service';
import { BinService } from '../../services/bin.service';
import { SiteService } from '../../services/site.service';
import { Site } from '../../models/site.model';
import { LegalEntityService } from '../../services/legalentity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getValueFromObjectByKey, getObjectByValue, getValueFromArrayOfObjectById, getObjectById, editValueAssignByCondition } from '../../generic/autocomplete';
import { CommonService } from '../../services/common.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { StocklineService } from '../../services/stockline.service';
import { ConfigurationService } from '../../services/configuration.service';
import { WorkOrderService } from '../../services/work-order/work-order.service';
import { WorkOrderType } from '../../models/work-order-type.model';
import { WorkOrderSettingsService } from '../../services/work-order-settings.service';


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
        };
    isEditMode: boolean = false;
    private onDestroy$: Subject<void> = new Subject<void>();
    breadcrumbs: MenuItem[] = [
        { label: 'Admin' },
        { label: 'WO Quote Settings' },
        { label: 'Create WO Quote Settings' }
    ];
    workOrderTypes: WorkOrderType[];
    moduleName: string = "WO Quote Settings";
//    workOrderViewList= [{label: "MPN View",value: 1},
//     {label: "WO View",value: 2}];
//    workOrderStatusRbList =[{label: "Open",value: 3},
//     {label: "Closed",value: 4},
//     {label: "Canceled",value: 5},
//     {label: "All",value: 6}];
    
    constructor(private router: Router, private workOrderService: WorkOrderService, private alertService: AlertService, private receivingCustomerWorkOrderService: WorkOrderSettingsService){
    }

    ngOnInit() {
        this.getAllWorkOrderTypes();
        if(this.receivingCustomerWorkOrderService.isEditWOQuoteSettingsList){
            this.isEditMode = true;
            this.receivingForm = this.receivingCustomerWorkOrderService.woQuoteSettingsData;
        }
    }

    getAllWorkOrderTypes(): void {
        this.workOrderService.getAllWorkOrderTypes().pipe(takeUntil(this.onDestroy$)).subscribe(
            result => {
                this.workOrderTypes = result;
                console.log(this.workOrderTypes);
            },
            err => {
                this.errorHandling(err);
            }
        );
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




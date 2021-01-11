import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
declare var $ : any;

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { ItemMasterService } from '../../services/itemMaster.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { TableModule } from 'primeng/table';
import { Table } from 'primeng/table';
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
    selector: 'app-wo-quote-settings-list',
    templateUrl: './wo-quote-settings-list.component.html',
    styleUrls: ['./wo-quote-settings-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
/** work-order-settings-list component*/
export class WOQuoteSettingsListComponent {
    title: string = "WO Quote settings";
    workflowList: any = [];
    auditHistory: any = [];
    modal: NgbModalRef;
    private onDestroy$: Subject<void> = new Subject<void>();
    selectedGridColumn: any[];
    selectedGridColumns: any[] = [
        { field: 'workOrderType', header: 'WO Type' },
        { field: 'prefix', header: 'Prefix' },
        { field: 'sufix', header: 'Sufix' },
        { field: 'startCode', header: 'Start code' },
        { field: 'validDays', header: 'Valid Days' }
    ];
    gridColumns = [
        { field: 'workOrderType', header: 'WO Type' },
        { field: 'prefix', header: 'Prefix' },
        { field: 'sufix', header: 'Sufix' },
        { field: 'startCode', header: 'Start code' },
        { field: 'validDays', header: 'Valid Days' }
    ];
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    data: any;
    filteredText: string;
    totalRecords: number = 0;
    totalPages: number = 0;
    noDatavailable: any;
    constructor(private workOrderService: WorkOrderService,
        private router: ActivatedRoute,
        private route: Router,
        private siteService: SiteService, private conditionService: ConditionService,
        private receivingCustomerWorkOrderService: WorkOrderSettingsService,
        private authService: AuthService,
        private modalService: NgbModal,
        private alertService: AlertService,
       
        private customerService: CustomerService,
       
        private itemMasterService: ItemMasterService,
      
        private vendorservice: VendorService,
       // private conditionService: ConditionService,
       
    ) {
    }

    ngOnInit() {
        this.receivingCustomerWorkOrderService.isEditWOQuoteSettingsList = false;
        this.receivingCustomerWorkOrderService.woQuoteSettingsData = {};
        this.selectedGridColumns = this.gridColumns;
        this.getAllWOQuoteSettings();
    }

    ngOnChange() {
        this.receivingCustomerWorkOrderService.isEditWOQuoteSettingsList = false;
        this.receivingCustomerWorkOrderService.woQuoteSettingsData = {};
    }

    columnsChanges() {
        // this.refreshList();
    }

    globalSearch(value) {
        this.pageIndex = 0;
        this.filteredText = value;
        this.customerService.getGlobalSearch(value, this.pageIndex, this.pageSize).subscribe(res => {
            this.data = res;
            if (res.length > 0) {
                this.totalRecords = res[0].totalRecords;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }
        })
    }

    getAuditHistoryById(rowData){
        this.workOrderService.getWOQuoteSettingHistory(rowData.workOrderQuoteSettingId)
        .subscribe(
            (res: any[])=>{
                this.auditHistory = res;
            }
        )
    }

    edit(rowData){
        this.receivingCustomerWorkOrderService.isEditWOQuoteSettingsList = true;
        this.receivingCustomerWorkOrderService.woQuoteSettingsData = rowData;
        this.route.navigateByUrl(`workordersettingsmodule/workordersettings/app-create-wo-quote-settings`);
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.auditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    getAllWOQuoteSettings(): void {
        this.workOrderService.getWOQuoteSettingList().pipe(takeUntil(this.onDestroy$)).subscribe(
            result => {
                this.workflowList = result;
                this.totalRecords = result.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }
        );
    }

    dismissModel() {
        if (this.modal != undefined)
            this.modal.close();
    }

    AddPage() {
        this.route.navigateByUrl('/workordersettingsmodule/workordersettings/app-create-wo-quote-settings');
    }
    openEdit(row) {
        this.route.navigateByUrl('/workordersettingsmodule/workordersettings/app-create-wo-quote-settings');
    }
    
}
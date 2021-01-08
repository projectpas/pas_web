import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import * as $ from 'jquery';

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
    selector: 'app-work-order-settings-list',
    templateUrl: './work-order-settings-list.component.html',
    styleUrls: ['./work-order-settings-list.component.scss']
})
/** work-order-settings-list component*/
export class WorkOrderSettingsListComponent {
    /** work-order-settings-list ctor */
    //constructor() {

    //}

    //testing data

    @Input() isWorkOrder;
    @Input() workFlowId;
    @Input() workFlowType;
    sourceWorkFlow: any;
    title: string = "Work order settings";
    workFlowGridSource: MatTableDataSource<any>;
    gridColumns: any[];
    selectedGridColumn: any[];
    selectedGridColumns: any[];
    selectedWorflow: any[];
    workflowList: any[];
    modal: NgbModalRef;
    currentWorkflow: any;
    allCustomers: any[];
    allCurrencyData: any[];
    assets: any[];
    toggle_wf_header: boolean = false;
    displayAccord1: boolean = false;

    toggle_detailhistory: boolean = false;
    currentWFList: any;
    MaterialCost: number;
    TotalCharges: number;
    TotalExpertiseCost: number;
    Total: number;
    PercentBERThreshold: number;
    tasks: any[];
    addedTasks: any[];
    allParts: any[];
    expertiseTypes: any[];
    assetTypes: any[];
    chargesTypes: any[];
    vendors: any[];
    materialCondition: any[];
    materialUOM: any[];
    materialMandatory: any[];
    itemClassification: any[];
    auditHistory: AuditHistory[];
    publications: any[];
    allVendors: any[];
    responseDataForWorkFlow: Object;

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
        this.workFlowGridSource = new MatTableDataSource();
        this.workOrderService = null;
    }

    ngOnInit() {
        this.getAllWorkflows();
      

    }

    public allWorkFlows: any[] = [];

    private getAllWorkflows() {
        this.alertService.startLoadingMessage();
        this.receivingCustomerWorkOrderService.getAllWorkFlows().subscribe(
           
            results => this.onWorkflowLoadSuccessful(results[0]),
           
            error => { }
           
        );

        this.gridColumns = [
            { field: 'workOrderType', header: 'WO Type' },
            { field: 'prefix', header: 'Prefix' },
            { field: 'sufix', header: 'Suffix' },
            { field: 'startCode', header: 'Start code' },
            // { field: 'recivingListDefaultRB', header: 'RecivingListDefaultRB' },
            { field: 'woListDefault', header: 'WO List View' },
            { field: 'woListStatusDefault', header: 'WO List Status' },
            // { field: 'defaultStatus', header: 'Status' },
            { field: 'defaultConditon', header: 'Default Condition' },
            // { field: 'defaultSite', header: 'Default Site' },
            // { field: 'defaultWarehouse', header: 'Default Wearhouse' },
            // { field: 'defaultLocation', header: 'Default Location' },
            // { field: 'defaultShelf', header: ' Default Shelf' },
            { field: 'defaultStageCode', header: 'Default Stage Code' },
            { field: 'defaultScope', header: 'Default Scope' },
            // { field: 'woListDefaultRB', header: ' WOListDefaultRB' },
            { field: 'defaultPriority', header: 'Priority' },
            //
        ];

        this.selectedGridColumns = this.gridColumns;
    }

    public applyFilter(filterValue: string) {
        this.workFlowGridSource.filter = filterValue;
    }


    private refresh() {
        this.applyFilter(this.workFlowGridSource.filter);
    }

    private onWorkflowLoadSuccessful(allWorkFlows: any[]) {
        this.alertService.stopLoadingMessage();
        this.workFlowGridSource.data = allWorkFlows;
        console.log((allWorkFlows));
        this.workflowList = allWorkFlows;
    }

    confirmDelete(confirmDeleteTemplate, rowData) {
        this.currentWorkflow = rowData;
        this.modal = this.modalService.open(confirmDeleteTemplate, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    edit(rowData) {
       // alert(JSON.stringify((rowData)));
        const {workOrderSettingId } = rowData;
        this.route.navigateByUrl(`workordersettingsmodule/workordersettings/app-create-work-order-settings/edit/${workOrderSettingId}`);
    }
    getAuditHistoryById(rowData) {
        this.receivingCustomerWorkOrderService.getAudit(rowData.workOrderSettingId).subscribe(res => {
            console.log(res);
            this.auditHistory = res;
        })
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


    AddPage() {
        this.route.navigateByUrl('/workordersettingsmodule/workordersettings/app-create-work-order-settings');
    }

    openEdit(row) {
        this.route.navigateByUrl('/workordersettingsmodule/workordersettings/app-create-work-order-settings');
    }

    dismissModel() {
        if (this.modal != undefined)
            this.modal.close();
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    onOpenAll() {
        console.log(this.addedTasks);
        for (let task of this.addedTasks) {
            task.selected = true;
        }
    }

    onCloseAll() {
        for (let task of this.addedTasks) {
            task.selected = false;
        }
    }

    publicationTypes: any[];

    
    //private setPublicationData(selectedPublication: any, row: any) {
    //    if (selectedPublication != null) {
    //        row.publicationName = selectedPublication.publicationId;
    //        row.publicationDescription = selectedPublication.description != null ? selectedPublication.description : '';
    //        row.revisionDate = selectedPublication.revisionDate != null ? new Date(selectedPublication.revisionDate).toLocaleDateString() : '';
    //        row.publicationType = selectedPublication.publicationTypeId != null ? selectedPublication.publicationTypeId : '';
    //        row.sequence = selectedPublication.sequence != null ? selectedPublication.sequence : '';
    //        row.itemMasterAircraftMapping = selectedPublication.itemMasterAircraftMapping;
    //        row.source = selectedPublication.asd != null ? selectedPublication.asd : '';
    //        row.location = selectedPublication.location != null ? selectedPublication.location : '';
    //        row.verifiedBy = selectedPublication.verifiedBy != null ? selectedPublication.verifiedBy : '';
    //        row.status = selectedPublication.isActive != null ? selectedPublication.isActive : '';
    //        row.verifiedDate = selectedPublication.verifiedDate != undefined ? new Date(selectedPublication.verifiedDate).toLocaleDateString() : '';
    //        row.attachmentURL = selectedPublication.attachmentDetails != null ? selectedPublication.attachmentDetails.link : '';
    //    }
    //    else {
    //        row.publicationDescription = '';
    //        row.revisionDate = '';
    //        row.publicationType = 0;
    //        row.sequence = '';
    //        row.source = '';
    //        row.location = '';
    //        row.verifiedBy = '';
    //        row.status = 0;
    //        row.verifiedDate = '';
    //        row.attachmentURL = '';
    //    }
    //}

    //private loadcustomerData() {
    //    this.customerService.getWorkFlows().subscribe(data => {
    //        this.allCustomers = data[0];
    //        var selectectedCustomer = this.allCustomers.filter(x => x.customerId == this.sourceWorkFlow.customerId);
    //        if (selectectedCustomer.length > 0) {
    //            this.sourceWorkFlow.customerName = selectectedCustomer[0].name;
    //        }

    //    });
    //}

    //private calculatePercentOfNew(myValue, percentValue) {
    //    this.sourceWorkFlow.percentOfNew = "";
    //    if (myValue && percentValue) {
    //        this.sourceWorkFlow.percentOfNew = (myValue / 100) * percentValue;
    //    }
    //    this.berDetermination();
    //}

    //private calculatePercentOfReplacement(myValue, percentValue) {
    //    this.sourceWorkFlow.percentOfReplacement = "";
    //    if (myValue && percentValue) {
    //        let afterpercent = myValue / 100;
    //        this.sourceWorkFlow.percentOfReplacement = afterpercent * percentValue;

    //    }
    //    this.berDetermination();
    //}

    //private berDetermination(): any {
    //    if (this.sourceWorkFlow.fixedAmount != undefined && this.sourceWorkFlow.fixedAmount != "") {
    //        this.sourceWorkFlow.berThresholdAmount = this.sourceWorkFlow.fixedAmount;
    //    }
    //    // check on is percentOfNew enable
    //    if (this.sourceWorkFlow.percentOfNew != undefined && this.sourceWorkFlow.percentOfNew != "") {
    //        this.sourceWorkFlow.berThresholdAmount = this.sourceWorkFlow.percentOfNew;
    //    }
    //    // check on is .percentOfReplacement enable
    //    if (this.sourceWorkFlow.percentOfReplacement != undefined && this.sourceWorkFlow.percentOfReplacement != "") {
    //        this.sourceWorkFlow.berThresholdAmount = this.sourceWorkFlow.percentOfReplacement;
    //    }


    //    // 1 and 2 check box 
    //    if (this.sourceWorkFlow.fixedAmount != undefined && this.sourceWorkFlow.fixedAmount != "" && this.sourceWorkFlow.percentOfNew != undefined && this.sourceWorkFlow.percentOfNew != "") {
    //        this.sourceWorkFlow.berThresholdAmount = Math.min(this.sourceWorkFlow.fixedAmount, this.sourceWorkFlow.percentOfNew);
    //    }

    //    // 2 and 3  check box 
    //    if (this.sourceWorkFlow.percentOfNew != undefined && this.sourceWorkFlow.percentOfNew != "" && this.sourceWorkFlow.percentOfReplacement != undefined && this.sourceWorkFlow.percentOfReplacement != "") {
    //        this.sourceWorkFlow.berThresholdAmount = Math.min(this.sourceWorkFlow.percentOfNew, this.sourceWorkFlow.percentOfReplacement);
    //    }
    //    // 1 and 3  check box 
    //    if (this.sourceWorkFlow.fixedAmount != undefined && this.sourceWorkFlow.fixedAmount != "" && this.sourceWorkFlow.percentOfReplacement != undefined && this.sourceWorkFlow.percentOfReplacement != "") {
    //        this.sourceWorkFlow.berThresholdAmount = Math.min(this.sourceWorkFlow.fixedAmount, this.sourceWorkFlow.percentOfReplacement);
    //    }


    //    //1 and 2 and 3 check box
    //    if (this.sourceWorkFlow.fixedAmount != undefined && this.sourceWorkFlow.fixedAmount != "" && this.sourceWorkFlow.percentOfNew != undefined && this.sourceWorkFlow.percentOfNew != "" && this.sourceWorkFlow.percentOfReplacement != undefined && this.sourceWorkFlow.percentOfReplacement != "") {
    //        this.sourceWorkFlow.berThresholdAmount = Math.min(this.sourceWorkFlow.fixedAmount, this.sourceWorkFlow.percentOfNew, this.sourceWorkFlow.percentOfReplacement);
    //    }
    //    //1 and 2 and 3 check box all uncheck 
    //    if (this.sourceWorkFlow.fixedAmount == undefined && this.sourceWorkFlow.percentOfNew == undefined && this.sourceWorkFlow.percentOfReplacement == undefined) {
    //        this.sourceWorkFlow.berThresholdAmount = 0;
    //    }
    //}

    
}
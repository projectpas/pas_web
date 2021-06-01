import { Component, Input, } from '@angular/core';
declare var $ : any;
import { AlertService} from '../../services/alert.service';
import { MatTableDataSource } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { AuditHistory } from '../../models/audithistory.model';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';//bread crumb
import { WorkOrderService } from '../../services/work-order/work-order.service';
import { WorkOrderSettingsService } from '../../services/work-order-settings.service';

@Component({
    selector: 'app-work-order-settings-list',
    templateUrl: './work-order-settings-list.component.html',
    styleUrls: ['./work-order-settings-list.component.scss']
})
/** work-order-settings-list component*/
export class WorkOrderSettingsListComponent {
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
    noDatavailable: any;
    breadcrumbs: MenuItem[];
    public allWorkFlows: any[] = [];
    publicationTypes: any[];
    isSpinnerVisible: boolean = true;

    constructor(private workOrderService: WorkOrderService,
        private route: Router,
        private receivingCustomerWorkOrderService: WorkOrderSettingsService,
        private authService: AuthService,
        private modalService: NgbModal,
        private alertService: AlertService,
    ) {
        this.workFlowGridSource = new MatTableDataSource();
        this.workOrderService = null;
    }

    ngOnInit() {
        this.getAllWorkflows();
            this.breadcrumbs = [
                { label: 'Work Order Settings' },
                { label: ' Work Order Settings List' },
            ];
    }
    
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
    }

    private getAllWorkflows() {
        this.isSpinnerVisible = true;
        this.receivingCustomerWorkOrderService.getAllWorkFlows(this.currentUserMasterCompanyId).subscribe(
            results => this.onWorkflowLoadSuccessful(results[0]),
            error => {this.isSpinnerVisible = false; }
        );

        this.gridColumns = [
            { field: 'workOrderType', header: 'WO Type' },
            { field: 'prefix', header: 'Prefix' },
            { field: 'sufix', header: 'Suffix' },
            { field: 'startCode', header: 'Start code' },
            { field: 'woListDefault', header: 'WO List View' },
            { field: 'woListStatusDefault', header: 'WO List Status' },
            { field: 'defaultConditon', header: 'Default Condition' },
            { field: 'defaultStageCode', header: 'Default Stage Code' },
            { field: 'defaultScope', header: 'Default Scope' },
            { field: 'defaultPriority', header: 'Priority' },
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
        this.isSpinnerVisible = false;
        this.workFlowGridSource.data = allWorkFlows;
        const data=allWorkFlows
        // data.forEach(element => {
        //     if(element.laborHoursMedthodId==1){ 
        //         element.laborHoursMedthod='Labor Hours';
        //     }else if(element.laborHoursMedthodId==2){
        //         element.laborHoursMedthod=='Labor ClockIn/Out';
        //     }else if(element.laborHoursMedthodId==3){
        //         element.laborHoursMedthod='Scan';
        //     }
        // });
              this.workflowList = data; 
    }

    confirmDelete(confirmDeleteTemplate, rowData) {
        this.currentWorkflow = rowData;
        this.modal = this.modalService.open(confirmDeleteTemplate, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    edit(rowData) {
        const {workOrderSettingId } = rowData;
        this.route.navigateByUrl(`workordersettingsmodule/workordersettings/app-create-work-order-settings/edit/${workOrderSettingId}`);
    }

    getAuditHistoryById(rowData) {
        this.receivingCustomerWorkOrderService.getAudit(rowData.workOrderSettingId).subscribe(res => {
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
    
   
}
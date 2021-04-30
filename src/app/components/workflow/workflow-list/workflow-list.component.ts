import { Component, OnInit,  Input, SimpleChanges } from '@angular/core';
import {  MatTableDataSource } from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { fadeInOut } from '../../../services/animations';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkFlowtService } from '../../../services/workflow.service';
import { ActionService } from '../../../Workflow/ActionService';
import { CustomerService } from '../../../services/customer.service';
import { CommonService } from '../../../services/common.service';
import { CurrencyService } from '../../../services/currency.service';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { AssetService } from '../../../services/asset/Assetservice';
import { VendorService } from '../../../services/vendor.service';
import { ConditionService } from '../../../services/condition.service';
import { UnitOfMeasureService } from '../../../services/unitofmeasure.service';
import { ItemClassificationService } from '../../../services/item-classfication.service';
import { AircraftManufacturerService } from '../../../services/aircraft-manufacturer/aircraftManufacturer.service';
import { AircraftModelService } from '../../../services/aircraft-model/aircraft-model.service';
import { DashNumberService } from '../../../services/dash-number/dash-number.service';
import { PublicationService } from '../../../services/publication.service';
import { formatNumberAsGlobalSettingsModule } from '../../../generic/autocomplete';
import { listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { MenuItem } from 'primeng/api';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { ConfigurationService } from '../../../services/configuration.service';
declare var $ : any;

@Component({
    selector: 'app-workflow-list',
    templateUrl: './workflow-list.component.html',
    styleUrls: ['./workflow-list.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe],
})

export class WorkflowListComponent implements OnInit {
    @Input() isWorkOrder;
    @Input() workFlowId;
    @Input() workFlowType;
    sourceWorkFlow: any;
    title: string = "Work Flow";
    workFlowGridSource: MatTableDataSource<any>;
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
    isSpinnerVisible: Boolean = true;
    toggle_detailhistory: boolean = false;
    currentWFList: any;
    MaterialCost: any;
    TotalCharges: any;
    TotalExpertiseCost: any;
    Total: any;
    PercentBERThreshold: number;
    tasks: any[];
    addedTasks: any[];
    expertiseTypes: any[];
    assetTypes: any[];
    chargesTypes: any[];
    vendors: any[];
    materialCondition: any[];
    materialUOM: any[];
    materialMandatory: any[];
    itemClassification: any[];
    publications: any[];
    allVendors: any[];
    responseDataForWorkFlow: Object;
    totalRecords: number = 0;
    totalPages: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    public allWorkFlows: any[] = [];
    publicationTypes: any[];
    lazyLoadEventData: any;
    lazyLoadEventDataInput: any;
    filterText: any = '';
    currentDeletedstatus: boolean = false;
    status: string = 'active';
    restorerecord: any = {};
    dateObject: any = {};
    targetData: any;
    selectedOnly : boolean = false;
    arrayItemlist:any=[]
    totalPercent:any=[];
    breadcrumbs: MenuItem[] = [
        { label: 'Work Flow' },
        { label: 'Work Flow List' }
    ];
    gridColumns: any[] = [
        { field: 'workOrderNumber', header: 'Workflow ID' },
        { field: 'version', header: 'Version Number',width:"60px" },
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'description', header: 'Work Scope' },
        { field: 'name', header: 'Customer Name' },
        { field: 'workflowCreateDate', header: 'WF Created Date' },
        { field: 'workflowExpirationDate', header: 'Expiration Date' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' }
    ];
    selectedColumn: any;
    sourceViewforDocumentListColumns = [
        { field: 'fileName', header: 'File Name' },
    ]
    totalExpertiseCostsum: any;
    materialPercentValue:any;
    expertisePercentValue:any;
    chargesPercentValue:any;
    othersPercentValue:any;

    constructor(private actionService: ActionService,
        private router: ActivatedRoute,
        private route: Router,
        private datePipe: DatePipe,
        private authService: AuthService,
        private configurations: ConfigurationService,
        private modalService: NgbModal,
        private alertService: AlertService,
        public workFlowtService: WorkFlowtService,
        public commonService: CommonService,
        private customerService: CustomerService,
        private currencyService: CurrencyService,
        private itemMasterService: ItemMasterService,
        private assetService: AssetService,
        private vendorservice: VendorService,
        private conditionService: ConditionService,
        private unitofmeasureService: UnitOfMeasureService,
        private itemClassificationService: ItemClassificationService,
        private aircraftManufacturerService: AircraftManufacturerService,
        private aircraftmodelService: AircraftModelService,
        private dashNumberService: DashNumberService,
        private publicationService: PublicationService,
    ) {
        this.workFlowGridSource = new MatTableDataSource();
        this.workFlowtService.listCollection = null;
    }

    ngOnInit() { 
        this.selectedGridColumns = this.gridColumns;
        if (this.isWorkOrder) { 
                this.onViewWFDetails('','onload');
                this.toggle_wf_header=true;
        }        
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    //Load Data for work Flow List
    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;

        if (this.filterText == '') {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status, isDeleted: this.currentDeletedstatus,masterCompanyId:this.authService.currentUser.masterCompanyId }
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        } else {
            this.globalSearch(this.filterText);
        }
    }

    getList(data) {
        this.isSpinnerVisible = true;
        data.filters.masterCompanyId = this.currentUserMasterCompanyId;   
        this.workFlowtService.getAllWorkFlowList(data).subscribe(res => {

            this.workflowList = res[0]['results'].map(x => {
                return {
                    ...x,
                    createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                    updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                    workflowCreateDate: x.workflowCreateDate ? this.datePipe.transform(x.workflowCreateDate, 'MM/dd/yyyy') : '',
                    workflowExpirationDate: x.workflowExpirationDate ? this.datePipe.transform(x.workflowExpirationDate, 'MM/dd/yyyy') : '',
                }
            });

            this.workFlowGridSource.data = this.workflowList;

            if (this.workflowList != undefined) {
                if (this.workflowList.length > 0) {
                    this.totalRecords = res[0]['totalRecordsCount'];
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                } else {
                    this.totalRecords = 0;
                    this.totalPages = 0;
                }
                this.isSpinnerVisible = false;
            } else {
                this.totalRecords = 0;
                this.totalPages = 0;
                this.isSpinnerVisible = false;
            }
        }, error => {this.isSpinnerVisible = false;})
    }

    globalSearch(value) {
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status, isDeleted: this.currentDeletedstatus,masterCompanyId:this.authService.currentUser.masterCompanyId };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData);
    }

    getListByStatus(status) {
        this.lazyLoadEventDataInput.first = 0;
        this.status = status;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status, isDeleted: this.currentDeletedstatus,masterCompanyId:this.authService.currentUser.masterCompanyId };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData);
    }

    dateFilterForWorkFlowList(date, field) {
        this.dateObject = {}
        date = moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if (date != "" && moment(date, 'MM/DD/YYYY', true).isValid()) {
            if (field == 'createdDate') {
                this.dateObject = { 'createdDate': date }
            } else if (field == 'updatedDate') {
                this.dateObject = { 'updatedDate': date }
            }
            else if (field == 'workflowCreateDate') {
                this.dateObject = { 'workflowCreateDate': date }
            }
            else if (field == 'workflowExpirationDate') {
                this.dateObject = { 'workflowExpirationDate': date }
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status, ...this.dateObject,masterCompanyId:this.authService.currentUser.masterCompanyId };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        } else {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status, ...this.dateObject };
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate) {
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate) {
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.workflowCreateDate) {
                delete this.lazyLoadEventDataInput.filters.workflowCreateDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.workflowExpirationDate) {
                delete this.lazyLoadEventDataInput.filters.workflowExpirationDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status, ...this.dateObject,masterCompanyId:this.authService.currentUser.masterCompanyId };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        }
    }

    getDeleteListByStatus(value) {
        this.lazyLoadEventDataInput.filters.isDeleted = value;
        this.lazyLoadEventDataInput.filters.masterCompanyId=this.authService.currentUser.masterCompanyId;
        this.currentDeletedstatus = value;
        if (value == true) {
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        } else {
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData);
        }
    }

    resetGlobalFilter() {
        this.filterText = '';
    }

    public applyFilter(filterValue: string) {
        this.workFlowGridSource.filter = filterValue;
    }

    confirmDelete(confirmDeleteTemplate, rowData) {
        this.currentWorkflow = rowData;
        this.modal = this.modalService.open(confirmDeleteTemplate, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    removeWorkFlow(): void {
        this.actionService.RemoveWorkFlow(this.currentWorkflow.workflowId, this.userName).subscribe(
            result => {
                this.alertService.showMessage(this.title, "ACC" + this.currentWorkflow.workflowId + ' deleted successfully.', MessageSeverity.success);
                this.getDeleteListByStatus(this.currentDeletedstatus)
            },
            error => {
                var message = '';
                if (error.error.constructor == Array) {
                    message = error.error[0].errorMessage;
                }
                else {
                    message = error.error.Message;
                }
                this.alertService.showMessage(this.title, message, MessageSeverity.error);
            });
        this.dismissModel();
    }

    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    restoreRecord() {
        this.commonService.updatedeletedrecords('Workflow', 'WorkflowId', this.restorerecord.workflowId).subscribe(res => {
            this.modal.close();
            this.getDeleteListByStatus(this.currentDeletedstatus)
            this.alertService.showMessage("Success", `Record was Restored successfully. `, MessageSeverity.success);
        }, error =>  { this.isSpinnerVisible = false;})
    }

    toggleIsActive(workflow: any, event): void {
        this.actionService.toggleState(workflow.workflowId, this.userName).subscribe(
            result => {
                this.getDeleteListByStatus(this.currentDeletedstatus);
                if (event.checked) {
                    this.alertService.showMessage(this.title, "Records was Activated successfully.", MessageSeverity.success);
                }
                else {
                    this.alertService.showMessage(this.title, "Records was In-Activated successfully.", MessageSeverity.success);
                }
            },
            error => {
                var message = '';
                if (error.error.constructor == Array) {
                    message = error.error[0].errorMessage;
                }
                else {
                    message = error.error.Message;
                }
                this.alertService.showMessage(this.title, message, MessageSeverity.error);
            }
        )
    }

    AddPage() {
        this.route.navigateByUrl('/workflowmodule/workflowpages/wf-create');
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    openEdit(row) {
        this.workFlowtService.listCollection = row;
        this.workFlowtService.enableUpdateMode = true;
        this.workFlowtService.currentWorkFlowId = row.workflowId;
        this.route.navigateByUrl(`/workflowmodule/workflowpages/wf-edit/${this.workFlowtService.currentWorkFlowId}`);
    }

    dismissModel() {
        if (this.modal != undefined)
            this.modal.close();
    }

    closeDeleteModal() {
		$("#downloadConfirmation").modal("hide");
	}

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    onOpenAllView() {
        for (let task of this.addedTasks) {
            task.selected = true;
        }
    }

    onCloseAllView() {
        for (let task of this.addedTasks) {
            task.selected = false;
        }
    }

    onAccordTabClick1(task: any) {
        task.selected = !task.selected;

    }

    onViewWFDetails(rowData,from): void {
        if(from=='html'){
            this.workFlowId=rowData.workflowId;
        }

        this.getAllPercentages();
        this.sourceWorkFlow = undefined;
        this.isSpinnerVisible = true;
        this.actionService.getWorkFlow(this.workFlowId).subscribe(
            workflow => {
                const sourceWF = workflow[0];
                this.sourceWorkFlow = {
                    ...sourceWF,
                    fixedAmount: sourceWF.fixedAmount ? formatNumberAsGlobalSettingsModule(sourceWF.fixedAmount, 2) : null,
                    costOfNew: sourceWF.costOfNew ? formatNumberAsGlobalSettingsModule(sourceWF.costOfNew, 2) : null,
                    // percentageOfNew: sourceWF.percentageOfNew ? formatNumberAsGlobalSettingsModule(sourceWF.percentageOfNew, 2) : null,
                    percentOfNew: sourceWF.percentOfNew ? formatNumberAsGlobalSettingsModule(sourceWF.percentOfNew, 2) : null,
                    costOfReplacement: sourceWF.costOfReplacement ? formatNumberAsGlobalSettingsModule(sourceWF.costOfReplacement, 2) : null,
                    // percentageOfReplacement: sourceWF.percentageOfReplacement ? formatNumberAsGlobalSettingsModule(sourceWF.percentageOfReplacement, 2) : null,
                    percentOfReplacement: sourceWF.percentOfReplacement ? formatNumberAsGlobalSettingsModule(sourceWF.percentOfReplacement, 2) : null,
                    otherCost: sourceWF.otherCost ? formatNumberAsGlobalSettingsModule(sourceWF.otherCost, 2) : null,
                    berThresholdAmount: sourceWF.berThresholdAmount ? formatNumberAsGlobalSettingsModule(sourceWF.berThresholdAmount, 2) : null,

                };
                this.sourceWorkFlow.workflowCreateDate = new Date(this.sourceWorkFlow.workflowCreateDate).toLocaleDateString();
                this.sourceWorkFlow.workflowExpirationDate = this.sourceWorkFlow.workflowExpirationDate != null && this.sourceWorkFlow.workflowExpirationDate != '' ? new Date(this.sourceWorkFlow.workflowExpirationDate).toLocaleDateString() : '';
                this.totalPercent.forEach(element => {
                    if(element.value ==this.sourceWorkFlow.percentageOfNew){
                        this.sourceWorkFlow.percentageOfNew=Number(element.label);
                       return ;
                    }   
                    if(element.value ==this.sourceWorkFlow.percentageOfReplacement){
                        this.sourceWorkFlow.percentageOfReplacement=Number(element.label);
                       return ;
                    }   
                });
                this.sourceWorkFlow.percentageOfNew=this.sourceWorkFlow.percentageOfNew? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.percentageOfNew, 2) : null;
                this.sourceWorkFlow.percentageOfReplacement=this.sourceWorkFlow.percentageOfReplacement? formatNumberAsGlobalSettingsModule(this.sourceWorkFlow.percentageOfReplacement, 2) : null,
                this.calculatePercentOfNew(workflow[0].costOfNew, this.sourceWorkFlow.percentageOfNew);
                this.calculatePercentOfReplacement(workflow[0].costOfReplacement, this.sourceWorkFlow.percentageOfReplacement);
            //   setTimeout(() => {
                this.calculateTotalWorkFlowCost();
                this.getAllTasks();
                this.isSpinnerVisible = false;
            },
            error => { this.isSpinnerVisible = false; });
    }

    onViewMaterialList(rowData): void {
        this.sourceWorkFlow = undefined;
        this.isSpinnerVisible = true;
        this.actionService.getWorkFlowWithMaterialList(rowData.workflowId).subscribe(
            workflow => {
                this.sourceWorkFlow = workflow[0];
              
                this.calculateWorkFlowTotalMaterialCost();
                this.getAllTasks();
                this.isSpinnerVisible = false;
            },
            error => {
                this.isSpinnerVisible = false;
            });
    }

    private setPublicationData(selectedPublication: any, row: any) {
        if (selectedPublication != null) {
            row.publicationName = selectedPublication.publicationId;
            row.publicationDescription = selectedPublication.description != null ? selectedPublication.description : '';
            row.revisionDate = selectedPublication.revisionDate != null ? new Date(selectedPublication.revisionDate).toLocaleDateString() : '';
            row.publicationType = selectedPublication.publicationTypeId != null ? selectedPublication.publicationTypeId : '';
            row.sequence = selectedPublication.sequence != null ? selectedPublication.sequence : '';
            row.itemMasterAircraftMapping = selectedPublication.itemMasterAircraftMapping;
            row.source = selectedPublication.asd != null ? selectedPublication.asd : '';
            row.location = selectedPublication.location != null ? selectedPublication.location : '';
            row.verifiedBy = selectedPublication.verifiedBy != null ? selectedPublication.verifiedBy : '';
            row.status = selectedPublication.isActive != null ? selectedPublication.isActive : '';
            row.verifiedDate = selectedPublication.verifiedDate != undefined ? new Date(selectedPublication.verifiedDate).toLocaleDateString() : '';
            row.attachmentURL = selectedPublication.attachmentDetails != null ? selectedPublication.attachmentDetails.link : '';
        }
        else {
            row.publicationDescription = '';
            row.revisionDate = '';
            row.publicationType = 0;
            row.sequence = '';
            row.source = '';
            row.location = '';
            row.verifiedBy = '';
            row.status = 0;
            row.verifiedDate = '';
            row.attachmentURL = '';
        }
    } 

    private calculatePercentOfNew(myValue, percentValue) { 
        this.sourceWorkFlow.percentOfNew = "";
        if (myValue && percentValue) {
            this.sourceWorkFlow.percentOfNew = formatNumberAsGlobalSettingsModule((myValue / 100) * percentValue, 2);
        }
    }

    private calculatePercentOfReplacement(myValue, percentValue) {
        this.sourceWorkFlow.percentOfReplacement = "";
        if (myValue && percentValue) {
            let afterpercent = myValue / 100;
            this.sourceWorkFlow.percentOfReplacement = formatNumberAsGlobalSettingsModule(afterpercent * percentValue, 2);

        }
    }

    getAllPercentages(): void {
        this.arrayItemlist=[];
        if (this.arrayItemlist && this.arrayItemlist.length == 0) {
            this.arrayItemlist.push(0);
        }
        this.isSpinnerVisible = true;
        this.commonService.autoSuggestionSmartDropDownList('[Percent]', 'PercentId', 'PercentValue', '', true, 0, this.arrayItemlist.join(),this.currentUserMasterCompanyId)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.totalPercent = res; 
            });
    }

    private calculateTotalWorkFlowCost(): void {
        this.MaterialCost = 0.00;
        this.TotalCharges = 0.00;
        this.TotalExpertiseCost = 0.00;
        for (let charges of this.sourceWorkFlow.charges) {
            this.TotalCharges += charges.extendedCost != undefined ? charges.extendedCost : 0.00;
        }
      const mdata=this.sourceWorkFlow;
      mdata.materialList.forEach(element => {
          return{
              ...element,
              extendedCost: element.extendedCost != undefined ?  parseFloat(element.extendedCost.toFixed(2))  : 0
          }
      });

        for (let material of mdata.materialList) {
            this.MaterialCost +=  material.extendedCost;
        }
        for (let expertise of this.sourceWorkFlow.expertise) {
            this.TotalExpertiseCost += expertise.laborOverheadCost != undefined ? expertise.laborOverheadCost : 0.00;
       }
        if( this.totalPercent &&  this.totalPercent.length !=0){
            this.totalPercent.forEach(element => {
                if(element.value == this.sourceWorkFlow.percentageOfMaterial){
                    return this.materialPercentValue=Number(element.label);
                }   
                if(element.value == this.sourceWorkFlow.percentageOfExpertise){
                    return this.expertisePercentValue=Number(element.label);
                }  
                if(element.value == this.sourceWorkFlow.percentageOfCharges){
                    return this.chargesPercentValue=Number(element.label);
                }  
                if(element.value == this.sourceWorkFlow.percentageOfOthers){
                    return this.othersPercentValue=Number(element.label);
                }  
            });
        }
 
        this.materialPercentValue =this.materialPercentValue ? this.materialPercentValue :0;
        this.expertisePercentValue =this.expertisePercentValue ? this.expertisePercentValue :0;
        this.chargesPercentValue =this.chargesPercentValue ? this.chargesPercentValue :0;
        this.othersPercentValue =this.othersPercentValue ? this.othersPercentValue :0;
     
        this.sourceWorkFlow.percentageOfMaterial =  this.materialPercentValue;
        const MaterialCost = this.MaterialCost;
        const val0 = ((MaterialCost / 100) *  this.sourceWorkFlow.percentageOfMaterial) + MaterialCost;
        this.MaterialCost = formatNumberAsGlobalSettingsModule(val0, 2);

        this.sourceWorkFlow.percentageOfExpertise = this.expertisePercentValue;
        const TotalExpertiseCost = parseFloat(this.TotalExpertiseCost.toString().replace(/\,/g, ''));
        const val1 = ((TotalExpertiseCost / 100) * this.sourceWorkFlow.percentageOfExpertise) + TotalExpertiseCost;
        this.TotalExpertiseCost = formatNumberAsGlobalSettingsModule(val1, 2);

        this.sourceWorkFlow.percentageOfCharges =this.chargesPercentValue;
        const TotalCharges = parseFloat(this.TotalCharges.toString().replace(/\,/g, ''));
        const val2= ((TotalCharges / 100) * this.sourceWorkFlow.percentageOfCharges) + TotalCharges;
        this.TotalCharges = formatNumberAsGlobalSettingsModule(val2, 2);

        // this.sourceWorkFlow.percentageOfOthers

        this.sourceWorkFlow.percentageOfOthers =this.othersPercentValue;

        this.sourceWorkFlow.otherCost=this.sourceWorkFlow.otherCost? this.sourceWorkFlow.otherCost :0.00;
        const otherCost1 = parseFloat(this.sourceWorkFlow.otherCost.toString().replace(/\,/g, ''));
        const val3 = ((otherCost1 / 100) * this.sourceWorkFlow.percentageOfOthers) + otherCost1;
        this.sourceWorkFlow.otherCost = formatNumberAsGlobalSettingsModule(val3, 2);
        const total = val0 + val1 + val2 + val3;
        this.Total = total ? formatNumberAsGlobalSettingsModule(total, 2) : 0.00;

        if (this.sourceWorkFlow.berThresholdAmount != 0 && this.Total) {

           const BRTH = this.sourceWorkFlow.berThresholdAmount ? parseFloat(this.sourceWorkFlow.berThresholdAmount.toString().replace(/\,/g, '')) : 0;
           const Tot = parseFloat(this.Total.toString().replace(/\,/g, ''));
           let percentageofBerThreshold: any = (Tot / BRTH )* 100;
                this.PercentBERThreshold = percentageofBerThreshold ? formatNumberAsGlobalSettingsModule(percentageofBerThreshold, 2) : 0.00;

        //    const BRTH = this.sourceWorkFlow.berThresholdAmount ? parseFloat(this.sourceWorkFlow.berThresholdAmount.toString().replace(/\,/g, '')) : 0;
        //    const Tot = parseFloat(this.Total.toString().replace(/\,/g, ''));
        //     const maxValue = Math.max(0, BRTH, Tot);
        //     const minValue = Math.min(BRTH, Tot) !== -Infinity ? Math.min(BRTH, Tot) : 0;
        //     let percentageofBerThreshold: any = (minValue) / (maxValue / 100);
        //     this.PercentBERThreshold = percentageofBerThreshold ? formatNumberAsGlobalSettingsModule(percentageofBerThreshold, 2) : 0.00;
        }
       this.TotalOtherCost=this.sourceWorkFlow.otherCost;
    }
    TotalOtherCost:any;
    private calculateWorkFlowTotalMaterialCost(): void {
        this.MaterialCost = 0;

        for (let material of this.sourceWorkFlow.materialList) {
            this.MaterialCost += material.extendedCost != undefined ? material.extendedCost : 0;
        }

        this.MaterialCost = this.MaterialCost ? formatNumberAsGlobalSettingsModule(this.MaterialCost, 2) : 0.00;

    }

    private getUniqueTask(): any[] {
        var tasks = [];
        var taskIds = [];
        if (this.sourceWorkFlow && this.sourceWorkFlow.charges && this.sourceWorkFlow.charges.length > 0) {
  
            for (var item of this.sourceWorkFlow.charges) {
                if (taskIds.indexOf(item.taskId) == -1) {
                    var task = this.tasks.filter(x => x.Id == item.taskId);
                    if (task.length > 0) {
                        task[0].selected = false;
                        taskIds.push(task[0].Id);
                        tasks.push(task[0]);
                    }
                }
            }
        }
        if (this.sourceWorkFlow && this.sourceWorkFlow.directions && this.sourceWorkFlow.directions.length > 0) { 
            for (var item of this.sourceWorkFlow.directions) {
                if (taskIds.indexOf(item.taskId) == -1) {
                    var task = this.tasks.filter(x => x.Id == item.taskId);
                    if (task.length > 0) {
                        task[0].selected = false;
                        taskIds.push(task[0].Id);
                        tasks.push(task[0]);
                    }
                }
            }
        }
        if (this.sourceWorkFlow && this.sourceWorkFlow.equipments && this.sourceWorkFlow.equipments.length > 0) {
            for (var item of this.sourceWorkFlow.equipments) {
                if (taskIds.indexOf(item.taskId) == -1) {
                    var task = this.tasks.filter(x => x.Id == item.taskId);
                    if (task.length > 0) {
                        task[0].selected = false;
                        taskIds.push(task[0].Id);
                        tasks.push(task[0]);
                    }
                }
            }
        }
        if (this.sourceWorkFlow && this.sourceWorkFlow.exclusions && this.sourceWorkFlow.exclusions.length > 0) {
            for (var item of this.sourceWorkFlow.exclusions) {
                if (taskIds.indexOf(item.taskId) == -1) {
                    var task = this.tasks.filter(x => x.Id == item.taskId);
                    if (task.length > 0) {
                        task[0].selected = false;
                        taskIds.push(task[0].Id);
                        tasks.push(task[0]);
                    }
                }
            }
        }
        if (this.sourceWorkFlow && this.sourceWorkFlow.expertise && this.sourceWorkFlow.expertise.length > 0) {
            for (var item of this.sourceWorkFlow.expertise) {
                if (taskIds.indexOf(item.taskId) == -1) {
                    var task = this.tasks.filter(x => x.Id == item.taskId);
                    if (task.length > 0) {
                        task[0].selected = false;
                        taskIds.push(task[0].Id);
                        tasks.push(task[0]);
                    }
                }
            }
        }
        if (this.sourceWorkFlow && this.sourceWorkFlow.materialList && this.sourceWorkFlow.materialList.length > 0) {
            for (var item of this.sourceWorkFlow.materialList) {
                if (taskIds.indexOf(item.taskId) == -1) {
                    var task = this.tasks.filter(x => x.Id == item.taskId);
                    if (task.length > 0) {
                        task[0].selected = false;
                        taskIds.push(task[0].Id);
                        tasks.push(task[0]);
                    }
                }
            }
        }
        if (this.sourceWorkFlow && this.sourceWorkFlow.measurements && this.sourceWorkFlow.measurements.length > 0) {
            for (var item of this.sourceWorkFlow.measurements) {
                if (taskIds.indexOf(item.taskId) == -1) {
                    var task = this.tasks.filter(x => x.Id == item.taskId);
                    if (task.length > 0) {
                        task[0].selected = false;
                        taskIds.push(task[0].Id);
                        tasks.push(task[0]);
                    }
                }
            }
        }
        if (this.sourceWorkFlow && this.sourceWorkFlow.publication && this.sourceWorkFlow.publication.length > 0) {
            for (var item of this.sourceWorkFlow.publication) {
                if (taskIds.indexOf(item.taskId) == -1) {
                    var task = this.tasks.filter(x => x.Id == item.taskId);
                    if (task.length > 0) {
                        task[0].selected = false;
                        taskIds.push(task[0].Id);
                        tasks.push(task[0]);
                    }
                }
            }
        }

        return tasks;
    }

    private getAllTasks(): void {
        // this.isSpinnerVisible = true; 
        this.actionService.getActions().subscribe(
            actions => {
                this.tasks = [];
                for (let attr of actions) {
                    this.tasks.push({ Id: attr.taskId, Name: attr.description, Description: "", Memo: "" })
                }
                this.tasks = this.tasks.sort((a, b) => a.Name.localeCompare(b.Name, 'es', {sensitivity: 'base'}))
                this.organiseTaskAndTaskAttributes();
                // this.loadPublicationTypes();
            },
            error => { }
        );
    }

    private organiseTaskAndTaskAttributes() {
        this.addedTasks = this.getUniqueTask();
        if (this.addedTasks && this.addedTasks.length != 0) {
            this.onAccordTabClick1(this.addedTasks[0]);
        }
        for (let task of this.addedTasks) {

            var chargesTotalQty = 0;
            var chargesTotalExtendedCost = 0;
            var chargesTotalChargesCost = 0;
            task.charges = this.sourceWorkFlow.charges.filter(x => {
                if (x.taskId == task.Id) {
                    // this.LoadChargesDropDownValues(x);
                    chargesTotalQty += x.quantity == undefined || x.quantity == '' ? 0 : x.quantity;
                    chargesTotalExtendedCost += x.extendedCost == undefined || x.extendedCost == '' ? 0 : x.extendedCost;
                    chargesTotalChargesCost += x.extendedPrice == undefined || x.extendedPrice == '' ? 0 : x.extendedPrice;
                }
                return x.taskId == task.Id
            });

            task.chargesTotalQty = chargesTotalQty;
            task.chargesTotalExtendedCost = chargesTotalExtendedCost ? formatNumberAsGlobalSettingsModule(chargesTotalExtendedCost, 2) : null;
            task.chargesTotalChargesCost = chargesTotalChargesCost ? formatNumberAsGlobalSettingsModule(chargesTotalChargesCost, 2) : null;
            task.directions = this.sourceWorkFlow.directions.filter(x => {
                return x.taskId == task.Id
            });

            task.equipments = this.sourceWorkFlow.equipments.filter(x => {
                if (x.taskId == task.Id) {
                }
                return x.taskId == task.Id
            });

            var qty = 0;
            var extendedQty = 0

            task.exclusions = this.sourceWorkFlow.exclusions.filter(x => {
                if (x.taskId == task.Id) {
                    qty += x.quantity == undefined || x.quantity == '' ? 0 : x.quantity;
                    extendedQty += x.extendedCost == undefined || x.extendedCost == '' ? 0 : x.extendedCost;
                }
                return x.taskId == task.Id
            });
            task.exclusionQty = qty;
            task.exclusionextendedQty = extendedQty ? formatNumberAsGlobalSettingsModule(extendedQty, 2) : null;


            var totalEstimatedHours = 0.00;
            var totalDirectLaborCost = 0;
            var totalOHCost = 0;
            var totalDirectLabourAndOHCost = 0;
            task.expertise = this.sourceWorkFlow.expertise.filter(x => {
                if (x.taskId == task.Id) {
                   totalEstimatedHours += x.estimatedHours;
                    totalDirectLaborCost += x.directLaborRate == undefined && x.directLaborRate == '' ? 0 : x.directLaborRate;
                    totalOHCost += x.overheadCost == undefined && x.overheadCost == '' ? 0 : x.overheadCost;
                    totalDirectLabourAndOHCost += x.laborOverheadCost == undefined && x.laborOverheadCost == '' ? 0 : x.laborOverheadCost;
                 
               
                }
                return x.taskId == task.Id;
            });
        
      task.expertiseTotalEstimatedHours=totalEstimatedHours;
           task.expertiseTotalDirectLaborCost=totalDirectLaborCost;
           task.expertiseTotalOHCost=totalOHCost;
           task.expertiseTotalDirectLabourAndOHCost=totalDirectLabourAndOHCost;
   task.expertiseTotalDirectLabourAndOHCost = task.expertiseTotalDirectLabourAndOHCost ? formatNumberAsGlobalSettingsModule(task.expertiseTotalDirectLabourAndOHCost, 2) : 0.00;
            var materialTotalQty = 0;
            var materialTotalExtendedCost = 0;
            var materialTotalPrice = 0;
            var materialTotalExtendedPrice = 0;

            task.materialList = this.sourceWorkFlow.materialList.filter(x => {
                if (x.taskId == task.Id) {
                    materialTotalQty += x.quantity == undefined || x.quantity == '' ? 0 : x.quantity;
                    materialTotalExtendedCost += x.extendedCost == undefined || x.extendedCost == '' ? 0 : x.extendedCost;
                    materialTotalPrice += x.price == undefined || x.price == '' ? 0 : x.price;
                    materialTotalExtendedPrice += x.extendedPrice == undefined || x.extendedPrice == '' ? 0 : x.extendedPrice;
                }
                return x.taskId == task.Id;
            });

            task.materialTotalQty = materialTotalQty;
            task.materialTotalExtendedCost = materialTotalExtendedCost ? formatNumberAsGlobalSettingsModule(materialTotalExtendedCost, 2) : null;
            task.materialTotalPrice = materialTotalPrice ? formatNumberAsGlobalSettingsModule(materialTotalPrice, 2) : null;
            task.materialTotalExtendedPrice = materialTotalExtendedPrice ? formatNumberAsGlobalSettingsModule(materialTotalExtendedPrice, 2) : null;

     

            task.measurements = this.sourceWorkFlow.measurements.filter(x => {
                return x.taskId == task.Id
            });

            task.publication = this.sourceWorkFlow.publication.filter(x => {
                return x.taskId == task.Id
            });


        }
             // modify the taks keys
     this.addedTasks.forEach(element => {
        if(element.charges){
            element.charges.forEach(x => {
          
                    x.unitCost= x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : null,
                    x.extendedCost= x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : null,
                    x.unitPrice= x.unitPrice ? formatNumberAsGlobalSettingsModule(x.unitPrice, 2) : null,
                    x.extendedPrice= x.extendedPrice ? formatNumberAsGlobalSettingsModule(x.extendedPrice, 2) : null
           
            });
        }

        if(element.materialList){
            element.materialList.forEach(x => {
                    x.unitCost= x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : null,
                    x.extendedCost= x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : null,
                    x.price= x.price ? formatNumberAsGlobalSettingsModule(x.price, 2) : null,
                    x.extendedPrice= x.extendedPrice ? formatNumberAsGlobalSettingsModule(x.extendedPrice, 2) : null

});
        }


if(element.expertise){

    
setTimeout(() => {
    element.expertise.forEach(x => {
        x.laborDirectRate= x.laborDirectRate ? formatNumberAsGlobalSettingsModule(x.laborDirectRate, 2) : 0.00,
        x.directLaborRate= x.directLaborRate ? formatNumberAsGlobalSettingsModule(x.directLaborRate, 2) : 0.00,
        x.overheadBurden= x.overheadBurden ? formatNumberAsGlobalSettingsModule(x.overheadBurden, 2) : 0.00,
        x.overheadCost= x.overheadCost ? formatNumberAsGlobalSettingsModule(x.overheadCost, 2) : 0.00,
        x.laborOverheadCost= x.laborOverheadCost ? formatNumberAsGlobalSettingsModule(x.laborOverheadCost, 2) : 0.00,
        x.estimatedHours=x.estimatedHours ? formatNumberAsGlobalSettingsModule(x.estimatedHours, 2) : 0.00
});
}, 1200);
}
if(element.exclusions){
    element.exclusions.forEach(x => {
          x.unitCost= x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : null,
                    x.extendedCost=x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : null,
                    x.estimtPercentOccurrance= x.estimtPercentOccurrance ? parseFloat(x.estimtPercentOccurrance).toFixed(2) : null
           
    });
}
    });
    }

 
    exportCSV(dt){
		this.isSpinnerVisible = true;
        const isdelete=this.currentDeletedstatus ? true:false;
		let PagingData = {"first":0,"rows":dt.totalRecords,"sortOrder":1,"filters":{"masterCompanyId":this.currentUserMasterCompanyId,"status":this.status,"isDeleted":isdelete},"globalFilter":""}
		let filters = Object.keys(dt.filters);
		filters.forEach(x=>{
			PagingData.filters[x] = dt.filters[x].value;
        })
        this.workFlowtService.getAllWorkFlowList(PagingData).subscribe(res => {
            dt._value = res[0]['results'].map(x => {
				return {
					...x,
                    createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                    updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
                    workflowExpirationDate: x.workflowExpirationDate ?  this.datePipe.transform(x.workflowExpirationDate, 'MMM-dd-yyyy hh:mm a'): '',
                    workflowCreateDate: x.workflowCreateDate ?  this.datePipe.transform(x.workflowCreateDate, 'MMM-dd-yyyy hh:mm a'): '',
				}
			});	
			dt.exportCSV();
			dt.value = this.workflowList;
        	this.isSpinnerVisible = false;
        },error => {this.isSpinnerVisible = false;})
    }
    documentList:any=[]; 
    openView(content,publication){
        this.documentList=publication.attachmentDetails;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    dismissModelView() {
        this.modal.close();
    }
    downloadFile(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
         window.location.assign(url);
    }
 

}
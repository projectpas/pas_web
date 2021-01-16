import { Component, OnInit, AfterViewInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuditHistory } from '../../../../models/audithistory.model';
import { MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { VendorService } from '../../../../services/vendor.service';
import { fadeInOut } from '../../../../services/animations';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { PurchaseOrderService } from '../../../../services/purchase-order.service';
import { VendorCapabilitiesService } from '../../../../services/vendorcapabilities.service';
import { CommonService } from '../../../../services/common.service';
declare var $ : any;
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { MenuItem } from 'primeng/api';
import { ReceivingService }  from '../../../../services/receiving/receiving.service';
import {AllViewComponent  } from '../../../../shared/components/all-view/all-view.component';
import * as moment from 'moment';
import { VendorWarningEnum } from '../../../../enum/vendorwarning.enum';

@Component({
	selector: 'app-polist',
	templateUrl: './polist.component.html',
    styleUrls: ['./polist.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})

export class PolistComponent implements OnInit {

    totalRecords: number = 0;
    isPoViewMode: boolean = false;
    totalPages: number = 0;
    breadcrumbs: MenuItem[];
    home: any;
    dateObject: any = {};
    filterSearchText : string;
    headers = [
		{ field: 'purchaseOrderNumber', header: 'PO Num' },
        { field: 'openDate', header: 'Open Date' },
        // { field: 'closedDate', header: 'Closed/Cancelled Date' },
        { field: 'vendorName', header: 'Vendor Name' },
        // { field: 'vendorCode', header: 'Vendor Code' },
        { field: 'status', header: 'Status' },
        { field: 'requestedBy', header: 'Requested By' },
        { field: 'approvedBy', header: 'Approved By' },
       
        { field: 'createdBy', header: 'CreatedBy' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'updatedBy', header: 'UpdatedBy' },
		{ field: 'updatedDate', header: 'Updated Date' },		
    ]
    selectedColumns = this.headers;
    data: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    @ViewChild('dt',{static:false})
    private table: Table;
    lazyLoadEventData: any;
    lazyLoadEventDataInput: any;
    auditHistory: AuditHistory[];
    rowDataToDelete: any = {};
    loadingIndicator: boolean;
    poHeaderAdd: any = {};
    poPartsList: any = [];
    approveList: any = [];
    vendorCapesInfo: any = [];
    vendorCapesCols: any[];
    headerManagementStructure: any = {};
    headerManagementStructureWithName: any = {};
    internalApproversList: any = [];
    purchaseOrderNoInput: any;
    openDateInput: any;
    capabilityauditHistory: any = [];
    closedDateInput: any;
    vendorNameInput: any;
    vendorCodeInput: any;
    statusIdInput: any;
    requestedByInput: any;
    approvedByInput: any;
    createdDateInput: any;
    createdByInput: any;
    updatedDateInput: any;
    updatedByInput: any;
    poTotalCost: number;
    ApprovedstatusId: number = 0;
    poApprovaltaskId: number = 0;
    isViewMode: boolean = true;
    capvendorId: number; 
    tabindex: number = 0; 
   
    @Input() isEnablePOList: boolean;
    @Input() vendorId: number;
    @Input() isApproverlist: boolean = false;    
    @Input() isReceivingPolist: boolean = false;    
    currentStatusPO: string = 'Open';
    modal: NgbModalRef;
    filterText: any = '';
    selectedPurchaseOrderId: any;
    poStatusList: any = [];
    isSpinnerVisible: boolean = true;
    vendorIdByParams: boolean = false;
    
    currentDeletedstatus: boolean = false;
    vendorCapesGeneralInfo: any = {};
    aircraftListDataValues: any;
    selectedOnly: boolean = false;
    targetData: any;
    approvalProcessHeader = [        
        {
            header: 'Action',
            field: 'actionStatus'
        },
        {
            header: 'Send Date',
            field: 'sentDate'
        }, {
            header: 'Status',
            field: 'status'
		}, {
            header: 'Memo',
            field: 'memo'
        }, {
            header: 'Approved By',
            field: 'approvedBy'
		}, {
            header: 'Approved Date',
            field: 'approvedDate'
        }, {
            header: 'Rejected By',
            field: 'rejectedBy'
		}, {
            header: 'Rejected Date',
            field: 'rejectedDate'
        }, {
            header: 'PN',
            field: 'partNumber'
        }, {
            header: 'PN Desc',
            field: 'partDescription'
        }, {
            header: 'ALT/Equiv PN',
            field: 'altEquiPartNumber'
        }, {
            header: 'ALT/Equiv PN Desc',
            field: 'altEquiPartDescription'
		}, {
            header: 'Item Type',
            field: 'itemType'
		}, {
            header: 'Stock Type',
            field: 'stockType'
		}, {
            header: 'Qty',
            field: 'qty'
		}, {
            header: 'Unit Cost',
            field: 'unitCost'
		}, {
            header: 'Ext Cost',
            field: 'extCost'
        }
	];
    approvalProcessList: any = [];
    moduleName:any="PurchaseOrder";
    constructor(private _route: Router,
        private authService: AuthService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        private alertService: AlertService,
        public vendorService: VendorService,
        private dialog: MatDialog,      
        private purchaseOrderService: PurchaseOrderService,
        private vendorCapesService: VendorCapabilitiesService,
        private commonService: CommonService,
        private datePipe: DatePipe,
        private receivingService: ReceivingService) {
        this.vendorService.ShowPtab = false;       
    }
    ngOnInit() {
        this.loadPOStatus();        
        this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-polist';
        this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
        if( this.isReceivingPolist == false ){
            this.breadcrumbs = [
                { label: 'Purchase Order' },
                { label: 'Purchase Order List' },
            ];
        }else{
            this.breadcrumbs = [
                { label: 'Receiving' },
                { label: 'Purchase Order' },
            ];
        }

    }
    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
	}
	get employeeId() {
	return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
	}    
    
    closeModal() {
        $("#downloadConfirmation").modal("hide");
    }
    loadPOStatus() {
		this.commonService.smartDropDownList('POStatus', 'POStatusId', 'Description').subscribe(response => {
			this.poStatusList = response;
			this.poStatusList = this.poStatusList.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
		},err => {
			this.isSpinnerVisible = false;					
		});
    }
    errorMessageHandler(log) {
		this.alertService.showMessage(
			'Error',
			log.error,
			MessageSeverity.error
		);
	}

    getPOListByStatus(status) {
        this.filterSearchText = "";
        this.currentStatusPO = status;       
        this.pageIndex = 0;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = this.pageIndex;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status, pageIndex: 1 };             
        this.isSpinnerVisible = true;     
        this.getList(this.lazyLoadEventDataInput);

    }
    restorerecord: any = {}
    restoreRecord() {
        this.commonService.updatedeletedrecords('PurchaseOrder', 'PurchaseOrderId', this.restorerecord.purchaseOrderId).subscribe(res => {
            this.getDeleteListByStatus(true)
            this.modal.close();
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        },err => {
			this.isSpinnerVisible = false;				
		});
    }
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });       
    }
    dismissModel() {
        this.modal.close();
    }
    getList(data) {
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete;
        data.filters.employeeId = this.employeeId;
        data.filters.masterCompanyId = this.currentUserMasterCompanyId;
        this.purchaseOrderService.getPOList(data).subscribe(res => { 
            const vList  = res['results'].map(x => {
                return {
                    ...x,
                    openDate: x.openDate ?  this.datePipe.transform(x.openDate, 'MM/dd/yyyy'): '',
                    closedDate: x.closedDate ?  this.datePipe.transform(x.closedDate, 'MM/dd/yyyy'): '',
                    createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a'): '',
                    updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a'): '',
                }
            });  
            this.data = vList;
            if (this.data.length > 0) {
                this.totalRecords = res['totalRecordsCount'];
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }else {
                this.data=[];
                this.totalRecords=0;
                this.totalPages=0;
            } 
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;           			
        });
    } 

    loadApprovalProcessStatus() {		
        this.commonService.smartDropDownList('ApprovalProcess', 'ApprovalProcessId', 'Name').subscribe(response => { 		        
		     response.forEach(x => {
                if (x.label.toUpperCase() == "APPROVED") {
                    this.ApprovedstatusId = x.value;
				}
            },err => {
                this.isSpinnerVisible = false;              	
            });
		});
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        this.table.reset();
    }
    loadData(event) {     
        this.isSpinnerVisible = true;
        this.lazyLoadEventData = event;
        this.pageIndex =  parseInt(event.first) / event.rows;
        this.pageSize = event.rows;
        event.first = this.pageIndex;
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatusPO } //openDate: this.todayDate
        if(this.isEnablePOList) {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, vendorId: this.vendorId }
        } 
        if(this.isApproverlist)
        {            
            this.currentStatusPO = 'Fulfilling';         
            this.getPOListByStatus(this.currentStatusPO);
        }else {
            if(this.filterText == '') {
                this.getList(this.lazyLoadEventDataInput);
            } else {
                this.globalSearch(this.filterText);
            }
        }
    }
    

    onChangeInputField(value, field, el) {       
        if (value === '') { el.classList.add("hidePlaceHolder"); }
        else el.classList.remove("hidePlaceHolder");
        
        if(field == "purchaseOrderNumber") {
            this.purchaseOrderNoInput = value;
        }
        if(field == "openDate") {
            this.openDateInput = value;
        }
        if(field == "closedDate") {
            this.closedDateInput = value;
        }
        if(field == "vendorName") {
            this.vendorNameInput = value;
        }
        if(field == "vendorCode") {
            this.vendorCodeInput = value;
        }
        if(field == "status") {
            if(this.currentStatusPO == 'All' ) {
            this.statusIdInput = value;
            } else {
                this.statusIdInput = this.currentStatusPO;
            }
        }
        if(field == "requestedBy") {
            this.requestedByInput = value;
        }
        if(field == "approvedBy") {
            this.approvedByInput = value;
        }
        if(field == "createdDate") {
            this.createdDateInput = value;
        }
        if(field == "createdBy") {
            this.createdByInput = value;
        }
        if(field == "updatedDate") {
            this.updatedDateInput = value;
        }
        if(field == "updatedBy") {
            this.updatedByInput = value;
        }


        this.lazyLoadEventDataInput.filters = {
            purchaseOrderNo: this.purchaseOrderNoInput,
            openDate: this.openDateInput,
            closedDate: this.closedDateInput,
            vendorName: this.vendorNameInput,
            vendorCode: this.vendorCodeInput,
            status: this.statusIdInput ? this.statusIdInput : this.currentStatusPO,
            requestedBy: this.requestedByInput,
            approvedBy: this.approvedByInput,
            vendorId: this.vendorId ? this.vendorId : null,
            createdDate: this.createdDateInput,
            createdBy: this.createdByInput,
            updatedDate : this.updatedDateInput,
            updatedBy: this.updatedByInput,
         
        }
        this.isSpinnerVisible = true;
        this.getList(this.lazyLoadEventDataInput);
    }
   
    dateFilterForPOList(date, field,el){
        if (date === '') { el.classList.add("hidePlaceHolder"); }
        else el.classList.remove("hidePlaceHolder");
        const minyear = '1900';
        const dateyear = moment(date).format('YYYY');;
        this.dateObject={}
        date=moment(date).format('MM/DD/YYYY');
        moment(date).format('MM/DD/YY');
        if(date !="" && moment(date, 'MM/DD/YYYY',true).isValid()){
            if(dateyear > minyear){
                if(field=='createdDate'){
                    this.dateObject={'createdDate':date}
                }else if(field=='updatedDate'){
                    this.dateObject={'updatedDate':date}
                }else if(field=='openDate'){
                    this.dateObject={'openDate':date}
                }else if(field=='closedDate'){
                    this.dateObject={'closedDate':date}
                }
                this.lazyLoadEventDataInput.filters = {   
                    ...this.lazyLoadEventDataInput.filters,                 
                    ...this.dateObject
                }
                this.getList(this.lazyLoadEventDataInput);                 
            }            
        }else{
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,...this.dateObject};
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate){
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate){
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.openDate){
                delete this.lazyLoadEventDataInput.filters.openDate;
            }
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.closedDate){
                delete this.lazyLoadEventDataInput.filters.closedDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,...this.dateObject};            
            this.getList(this.lazyLoadEventDataInput); 
        }
    }


    changeStatus(rowData) {           
        this.purchaseOrderService.getPOStatus(rowData.purchaseOrderId, rowData.isActive, this.userName).subscribe(res => {
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        },err => {
			this.isSpinnerVisible = false;			
		});

    }
    edit(rowData) {	
        const { purchaseOrderId } = rowData;
        this._route.navigateByUrl(`vendorsmodule/vendorpages/app-purchase-setup/edit/${purchaseOrderId}`);
    }
    delete(rowData) {
        this.rowDataToDelete = rowData;    }
    deletePO() {
        const { purchaseOrderId } = this.rowDataToDelete;
        this.purchaseOrderService.deletePO(purchaseOrderId, this.userName).subscribe(res => {
            this.isSpinnerVisible = true;   
            this.getList(this.lazyLoadEventData);
            this.alertService.showMessage("Success", `Successfully Deleted Record`, MessageSeverity.success);
        },err => {
			this.isSpinnerVisible = false;				
		});
    }

    viewSelectedRow(rowData) {       
        this.modal = this.modalService.open(AllViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.componentInstance.OrderId = rowData.purchaseOrderId;        
        this.modal.componentInstance.OrderType = 'Purchase Order';
        this.modal.componentInstance.PovendorId = rowData.vendorId;
        this.warningsandRestriction(rowData.vendorId);
    }

    //#region All Binding 
    warningMessage:any;
	warningID:any = 0;
    isEditWork:any = false;
	restrictID:any = 0;
	restrictMessage:any;
	WarningsList: any;
	WarningListId:any;
	warningsandRestriction(Id) {       
            this.WarningListId = VendorWarningEnum.Create_Purchase_Requisition;
            if (Id && this.WarningListId) {
                this.commonService.vendorWarningsAndRestrction(Id, this.WarningListId).subscribe((res: any) => {
                    if (res) {
                        if(res.warning) {
                        this.warningMessage = res.warningMessage;
                        this.warningID = res.vendorWarningId;
                        this.restrictID == 0;
                       }                       
                    }
                },err => {
                    this.isSpinnerVisible = false;                   
                });
            }
    } 
    
    viewSelectedRowdbl(rowData) {       
        this.viewSelectedRow(rowData);
    }

	getApproversByTask(poId) {
		this.isSpinnerVisible = true;
		this.purchaseOrderService.approverslistbyTaskId(this.poApprovaltaskId, poId).subscribe(res => {
						 this.internalApproversList = res;
						 this.isSpinnerVisible = false;
						},
						err =>{
							 this.isSpinnerVisible = false;
						 });

	}    
    
    globalSearch(value) {        
        this.pageIndex =this.lazyLoadEventDataInput.rows > 10 ? parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows : 0;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = this.pageIndex;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.filterText = value;

        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatusPO };
        if (this.isEnablePOList) {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, vendorId: this.vendorId }
        }       
        this.isSpinnerVisible = true;
        this.getList(this.lazyLoadEventDataInput);
      
    }
    getDeleteListByStatus(value) {
        this.currentDeletedstatus = true;       
        //const pageIndex = this.lazyLoadEventDataInput.rows > 10 ? parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows : 0;
        this.pageIndex = this.lazyLoadEventDataInput.rows > 10 ? parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows : 0;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = this.pageIndex; 
        if (value == true) {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatusPO };
            this.isSpinnerVisible = true;   
            this.getList(this.lazyLoadEventDataInput);
        } else {
            this.currentDeletedstatus = false;   
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatusPO };
            this.isSpinnerVisible = true;   
            this.getList(this.lazyLoadEventDataInput);
        }
    }

    getAuditHistoryById(rowData) {
        this.isSpinnerVisible = true;
        this.purchaseOrderService.getPOHistory(rowData.purchaseOrderId).subscribe(res => {                
            this.auditHistory = res;
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
            const errorLog = err;
			this.errorMessageHandler(errorLog);
        });
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

    getColorCodeForCapHistory(i, field, value) {
        const data = this.capabilityauditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
	}

    closeViewModal() {
        $("#poView").modal("hide");
    }

    closeHistoryModal() {
        $("#poHistory").modal("hide");
    }

    closeDeleteModal() {
        $("#poDelete").modal("hide");
    }  

  
    formatePrice(value) {
        if(value){
            return formatNumberAsGlobalSettingsModule(value, 2);
        }
        return '0.00';
    }

    getTotalDiscAmount(array) {
        let totalDiscAmount = 0;
        if(array){
            array.map(x => {			
                x.tempDiscAmt = x.discountAmount ? parseFloat(x.discountAmount.toString().replace(/\,/g,'')) : 0;
                totalDiscAmount += x.tempDiscAmt;
            })
            totalDiscAmount = totalDiscAmount ? formatNumberAsGlobalSettingsModule(totalDiscAmount, 2) : '0.00';
        }
        return totalDiscAmount;
    }
    
    getTotalExtCost(array) {
        let totalExtCost = 0;
        if(array){
            array.map(x => {			
                x.tempExtCost = x.extendedCost ? parseFloat(x.extendedCost.toString().replace(/\,/g,'')) : 0;
                totalExtCost += x.tempExtCost;
            })
            totalExtCost = totalExtCost ? formatNumberAsGlobalSettingsModule(totalExtCost, 2) : '0.00';
        }
        return totalExtCost;
    }

    public getSelectedRow(rowData) {
        this.receivingService.purchaseOrderId = rowData.purchaseOrderId;
        this._route.navigateByUrl(`/receivingmodule/receivingpages/app-receivng-po?purchaseOrderId=${rowData.purchaseOrderId}`);
    }

    public editStockLine(rowData) {
        this.receivingService.purchaseOrderId = rowData.purchaseOrderId;
        this._route.navigateByUrl(`/receivingmodule/receivingpages/app-edit-po?purchaseOrderId=${rowData.purchaseOrderId}`);
    }
    
	exportCSV(dt) {
        this.isSpinnerVisible = true;
        const isdelete = this.currentDeletedstatus ? true : false;
		//let PagingData = { ...dt, filters: listSearchFilterObjectCreation(dt.filters), status: status, "rows":dt.totalRecords }
		let PagingData = {"first":0,"rows":dt.totalRecords,"sortOrder":1,"filters":{"employeeId":this.employeeId,"masterCompanyId" :this.currentUserMasterCompanyId,"status":this.currentStatusPO,"isDeleted":isdelete},"globalFilter":""}
		let filters = Object.keys(dt.filters);
		filters.forEach(x=>{
			PagingData.filters[x] = dt.filters[x].value;
        });
        
        this.purchaseOrderService.getPOList(PagingData).subscribe(res => {
            const vList  = res['results'].map(x => {
                return {
                    ...x,
                    openDate: x.openDate ?  this.datePipe.transform(x.openDate, 'MMM-dd-yyyy'): '',
                    closedDate: x.closedDate ?  this.datePipe.transform(x.closedDate, 'MMM-dd-yyyy'): '',
                    createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                    updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
                }
            });      
              
            dt._value = vList;
            dt.exportCSV();
            dt.value = vList;
            this.isSpinnerVisible = false;           
        }, err => {
            this.isSpinnerVisible = false;    
        });
	
    }
}

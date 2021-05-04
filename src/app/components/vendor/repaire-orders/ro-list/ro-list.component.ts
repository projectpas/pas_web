import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuditHistory } from '../../../../models/audithistory.model';
import { AuthService } from '../../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { VendorService } from '../../../../services/vendor.service';
import { fadeInOut } from '../../../../services/animations';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { RepairOrderService } from '../../../../services/repair-order.service';
import { VendorCapabilitiesService } from '../../../../services/vendorcapabilities.service';
import { CommonService } from '../../../../services/common.service';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
declare var $ : any;
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuItem } from 'primeng/api';
import {AllViewComponent  } from '../../../../shared/components/all-view/all-view.component';
import * as moment from 'moment';
import { StatusEnum } from '../../../../enum/status.enum';


@Component({
	selector: 'app-ro-list',
	templateUrl: './ro-list.component.html',
	styleUrls: ['./ro-list.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
/** Rolist component*/
export class RoListComponent implements OnInit {
	totalRecords: number = 0;
    totalPages: number = 0;
    breadcrumbs: MenuItem[];
    home: any;    
    dateObject: any = {};
    strVendorName: string;
    strVendorCode: string;
    orderId: number ;
    orderType: string ='Repair Order';
    PovendorId:number;
    headers = [
		{ field: 'repairOrderNumber', header: 'RO Num',width:"90px" },
        { field: 'openDate', header: 'Open Date',width:"100px" },
       // { field: 'closedDate', header: 'Closed/Can Date' },
        { field: 'vendorName', header: 'Vendor Name' },
        //{ field: 'vendorCode', header: 'Vendor Code' },
        { field: 'status', header: 'Status', width:"90px" },
        { field: 'requestedBy', header: 'Requested By' },
        { field: 'approvedBy', header: 'Approved By' },        
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'CreatedBy' },       
        { field: 'updatedDate', header: 'Updated Date' },	
        { field: 'updatedBy', header: 'UpdatedBy' },
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
    roHeaderAdd: any = {};
    roPartsList: any = [];
    approveList: any = [];
    vendorCapesInfo: any = [];
    vendorCapesCols: any[];
    headerManagementStructure: any = {};
    repairOrderNoInput: any;
    openDateInput: any;
    closedDateInput: any;
    createdDateInput: any;
    updatedDateInput: any;
    vendorNameInput: any;
    vendorCodeInput: any;
    statusIdInput: any;
    requestedByInput: any;
    createdByInput: any;    
    updatedByInput: any;
    approvedByInput: any;
    @Input() isEnableROList: boolean;
    @Input() vendorId: number;
    @Input() isApproverlist: boolean = false;   
    @Input() isReceivingRolist : boolean = false;
    currentStatus: string = 'Open';
    filterText: any = '';
    selectedrepairOrderId: any;
    roStatusList: any = [];
    isSpinnerVisible: boolean = true;
    currentDeletedstatus: boolean = false;
    modal: NgbModalRef;
    vendorCapesGeneralInfo: any = {};
    aircraftListDataValues: any;
    ApprovedstatusId: number = 0;
    roApprovaltaskId: number = 0;
    selectedOnly: boolean = false;
    targetData: any;    
    internalApproversList: any = [];
    roTotalCost: number;
    isReceivingro:boolean;
    approvalProcessHeader = [        
        {
            header: 'Action',
            field: 'actionStatus'
        },
        {
            header: 'Sent Date',
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
            header: 'PN',
            field: 'partNumber'
        }, {
            header: 'PN Desc',
            field: 'partDescription'
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
    currentStatusPO: any;
    filterSearchText: any;
    openStatusId: number  = 0
    pendingStatusId: number  = 0
    fulfillingStatusId: number  = 0
    closedStatusId: number  = 0
    canceledStatusId: number  = 0
    descriptionStatusId: number  = 0
    closingStatusId: number  = 0

    constructor(private _route: Router,
        private authService: AuthService,
        private alertService: AlertService,
        public vendorService: VendorService,       
        private repairOrderService: RepairOrderService,        
        private vendorCapesService: VendorCapabilitiesService,
        private commonService: CommonService,
        private modalService: NgbModal,
        private datePipe: DatePipe) {
        this.vendorService.ShowPtab = false; 
        this.openStatusId = StatusEnum.Open;    
        this.pendingStatusId = StatusEnum.Pending;    
        this.fulfillingStatusId = StatusEnum.Fulfilling;    
        this.closedStatusId = StatusEnum.Closed;    
        this.canceledStatusId = StatusEnum.Canceled;    
        this.descriptionStatusId = StatusEnum.Description;    
        this.closingStatusId = StatusEnum.Closing;    
    }

    ngOnInit() {
        this.loadROStatus();
        this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-ro-list';        
        if(this.isReceivingRolist == false){
            this.breadcrumbs = [
                { label: 'Repair Order' },
                { label: 'Repair Order List' },
            ];
        } else {
            this.currentStatus="Fulfilling";
            this.breadcrumbs = [
                { label: 'Receiving' },
                { label: 'Repair Order' },
            ];
        }      
    }

    closeModal() {
        $("#downloadConfirmation").modal("hide");
    }

    loadROStatus() {
		this.commonService.smartDropDownList('ROStatus', 'ROStatusId', 'Description').subscribe(response => {
			this.roStatusList = response;
			this.roStatusList = this.roStatusList.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
        },err => {const errorLog = err;
            this.isSpinnerVisible = false;
        });
	}
    getROListByStatus(status) {
        
        this.currentStatus = status;
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
        this.isSpinnerVisible = true;
        this.getList(this.lazyLoadEventDataInput);
    }  

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
	}
	get employeeId() {
	return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
	}

    getList(data) {
        this.isSpinnerVisible = true;
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete;    
        data.filters.employeeId = this.employeeId;
        data.filters.masterCompanyId = this.currentUserMasterCompanyId;  
        this.repairOrderService.getROList(data).subscribe(res => {
               const vList  = res[0]['results'].map(x => {
                return {
                    ...x,
                //     openDate: x.openDate ?  this.datePipe.transform(x.openDate, 'MM/dd/yyyy'): '',
                //     closedDate: x.closedDate ?  this.datePipe.transform(x.closedDate, 'MM/dd/yyyy'): '',
                //     createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a'): '',
                //     updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a'): '',
                       openDate: x.openDate ?  this.datePipe.transform(x.openDate, 'MMM-dd-yyyy'): '',                     
                       createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                       updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',
                }
            });  
            this.data = vList;
           
            if (this.data.length > 0) {
                this.totalRecords = res[0]['totalRecordsCount'];
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }else {
                this.data=[];
                this.totalRecords=0;
                this.totalPages=0;
            } 
            this.isSpinnerVisible = false;
        },err => {this.isSpinnerVisible = false;});
    }

    loadApprovalProcessStatus() {		
        this.commonService.smartDropDownList('ApprovalProcess', 'ApprovalProcessId', 'Name').subscribe(response => { 		        
		     response.forEach(x => {
                if (x.label.toUpperCase() == "APPROVED") {
                    this.ApprovedstatusId = x.value;
				}
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
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatus };
        if(this.isEnableROList) {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, vendorId: this.vendorId }
        }
        this.isSpinnerVisible = true;
        if(this.filterText == '') {
            this.getList(this.lazyLoadEventDataInput);
        } else {
            this.globalSearch(this.filterText);
        } 
                
        if(this.isApproverlist)
        {           
            this.currentStatus = 'Fulfilling';         
            this.getROListByStatus(this.currentStatus);
        }
    }

    onChangeInputField(value, field, el) {            
        if (value === '') { el.classList.add("hidePlaceHolder"); }
        else el.classList.remove("hidePlaceHolder");

        if(field == "repairOrderNumber") {
            this.repairOrderNoInput = value;
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
            this.statusIdInput = value;
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
        if(field == "updatedDate") {
            this.updatedDateInput = value;
        }  
        if(field == "createdBy") {
            this.createdByInput = value;
        }      
        if(field == "updatedBy") {
            this.updatedByInput = value;
        }      

        this.lazyLoadEventDataInput.filters = {
            repairOrderNo: this.repairOrderNoInput,
            openDate: this.openDateInput,
            closedDate: this.closedDateInput,
            vendorName: this.vendorNameInput,
            vendorCode: this.vendorCodeInput,
            status: this.statusIdInput ? this.statusIdInput : this.currentStatus,
            requestedBy: this.requestedByInput,
            approvedBy: this.approvedByInput,
            vendorId: this.vendorId ? this.vendorId : null,
            createdDate : this.createdDateInput,
            updatedDate : this.updatedDateInput,
            createdBy: this.createdByInput,           
            updatedBy: this.updatedByInput,
        }        
        this.getList(this.lazyLoadEventDataInput);
    }
    
    dateFilterForROList(date, field,el){
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
   
    edit(rowData) {		
        const { repairOrderId } = rowData;
        this._route.navigateByUrl(`vendorsmodule/vendorpages/app-ro-setup/edit/${repairOrderId}`);
    }

    delete(rowData) {
        this.rowDataToDelete = rowData;
    }

    exportCSV(tt) {
        this.isSpinnerVisible = true;
        const isdelete = this.currentDeletedstatus ? true : false;
        let PagingData;
        PagingData = { "filters": { "employeeId":this.employeeId,"masterCompanyId" :this.currentUserMasterCompanyId, "statusId": "0", "viewType": "pnview", "isDeleted": this.currentDeletedstatus }, "first": 0, "rows": tt.totalRecords, "sortOrder": 1, "globalFilter": "" };
        // let PagingData: ISalesSearchParameters = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "status": this.currentStatus, "isDeleted": isdelete }, "globalFilter": "" }
        let filters = Object.keys(tt.filters);
        filters.forEach(x => {
          PagingData.filters[x] = tt.filters[x].value;
        });
        this.repairOrderService.getROList(PagingData).subscribe(res => {               
            // const vList = res[0]['results'].map(x => {
            tt._value = res[0]['results'].map(x => {
                return {
                  ...x,                                    
                    openDate: x.openDate ?  this.datePipe.transform(x.openDate, 'MMM-dd-yyyy'): '',
                    closedDate: x.closedDate ?  this.datePipe.transform(x.closedDate, 'MMM-dd-yyyy'): '',
                    createdDate: x.createdDate ?  this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a'): '',
                    updatedDate: x.updatedDate ?  this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a'): '',                
                   }
                });
                tt.exportCSV();
                tt.value = this.data;
                this.isSpinnerVisible = false; 
                // tt._value = vList;
                // tt.exportCSV();
                // tt.value = vList;
                // this.isSpinnerVisible = false;                
            }, err => {  this.isSpinnerVisible = false;});
    } 

    deleteRO() {
        const { repairOrderId } = this.rowDataToDelete;
        this.repairOrderService.deleteRO(repairOrderId, this.userName).subscribe(res => {
            this.getList(this.lazyLoadEventData);
            this.alertService.showMessage("Success", `Successfully Deleted Record`, MessageSeverity.success);
        });
    }
    
    viewSelectedRow(content, rowData) {        
        this.strVendorName =  rowData.vendorName;
        this.strVendorCode =  rowData.vendorCode;
        this.vendorId = rowData.vendorId;
        this.PovendorId = rowData.vendorId;
        this.orderId = rowData.repairOrderId;
        this.orderType = 'Repair Order';
        if(this.isReceivingRolist == true){
            this.isReceivingro = true;
        }
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }
  

    globalSearch(value) {     
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.filterText = value;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatus };
        if (this.isEnableROList) {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, vendorId: this.vendorId }
        }
        this.getList(this.lazyLoadEventDataInput);        
    }

    getDeleteListByStatus(value) {
        this.currentDeletedstatus = true;    
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.isSpinnerVisible = true;
        if (value == true) {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatus };
            this.getList(this.lazyLoadEventDataInput);
        } else {
            this.currentDeletedstatus = false;  
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatus };
            this.getList(this.lazyLoadEventDataInput);
        }
    }

    restorerecord: any = {}
    restoreRecord() {
        this.commonService.updatedeletedrecords('RepairOrder', 'RepairOrderId', this.restorerecord.repairOrderId).subscribe(res => {
            this.getDeleteListByStatus(true)
            this.modal.close();
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        },err => {const errorLog = err;
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

    getAuditHistoryById(rowData) {
        this.isSpinnerVisible = true;
        this.repairOrderService.getROHistory(rowData.repairOrderId).subscribe(res => {                     
            this.auditHistory = res;
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
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

    closeViewModal() {
        $("#roView").modal("hide");
    }

    closeHistoryModal() {
        $("#roHistory").modal("hide");
    }

    closeDeleteModal() {
        $("#roDelete").modal("hide");
    } 
   
    totalExportRow : number = 0;
    exportSelectedBtn(tt){ 
        this.selectedOnly = true;
        this.totalExportRow = tt.selection.length;  
    }

    public getSelectedRow(rowData) {       
        this._route.navigateByUrl(`/receivingmodule/receivingpages/app-receiving-ro?repairOrderId=${rowData.repairOrderId}`);
    }

    public editStockLine(rowData) {      
        this._route.navigateByUrl(`/receivingmodule/receivingpages/app-edit-ro?repairOrderId=${rowData.repairOrderId}`);
    }

    public viewSummary(rowData) {
        this._route.navigateByUrl(`/receivingmodule/receivingpages/app-view-ro?repairOrderId=${rowData.repairOrderId}`);
    }
}

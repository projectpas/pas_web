import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatIcon } from '@angular/material';
import { AuthService } from '../../../services/auth.service';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, DialogType, MessageSeverity } from '../../../services/alert.service';
import { CustomerService } from '../../../services/customer.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { TableModule, Table } from 'primeng/table';
import { LazyLoadEvent, SortEvent, MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { AccountListingService } from '../../../services/account-listing/account-listing.service'
import { GlAccountService } from '../../../services/glAccount/glAccount.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs'
declare var $ : any;
import * as moment from 'moment';
import { CommonService } from '../../../services/common.service';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-account-listing',
    templateUrl: './account-listing.component.html',
    styleUrls: ['./account-listing.component.scss'],
    providers: [DatePipe],
})

/** Account List component*/
export class AccountListingComponent implements OnInit {

    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    isSpinnerVisible: boolean = false;
    loadingIndicator: any;
    totalPages: number;
    viewRowData: any;
    status: any = "Active";
    currentstatus: string = 'Active';
    private onDestroy$: Subject<void> = new Subject<void>();
    headers = [
        { field: 'accountCode', header: 'Account Code' },
        { field: 'oldAccountCode', header: 'Old Account Code' },
        { field: 'accountName', header: 'Account Name' },
        { field: 'accountTypeId', header: 'Account Type' },
        { field: 'accountDescription', header: 'Account Description' },
        { field: 'ledgerName', header: 'Shared Ledger' },
        { field: 'leafNodeName', header: 'Leaf Node Name' },
        { field: 'interCompany', header: 'Inter Company' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'CreatedBy' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'UpdatedBy' },
    ]
    selectedColumns = this.headers;
    data: any;
    GlaccountListdata: any = [];
    auditHistory: any[] = [];
    first = 0;
    @ViewChild('dt',{static:false})
    private table: Table;
    isDeleteMode: boolean = false;    
    public DeleteGlAccountId: any;
    lazyLoadEventData: any;
    filterKeysByValue: object = {};
    home: any;
    breadcrumbs: MenuItem[];
    exportData: any = [];
    lazyLoadEventDataInput: any;
    filteredText: string;
    selectedRowforDelete: any;
    modal: NgbModalRef;
    filterText: boolean = false;
    viewIsActive: boolean = false;
    currentDeletedstatus: boolean = false;
    restoreRecordData: any;
    selectedOnly: boolean = false;
    targetData: any;    
    sourceEmployee: any;
    Active: any;
    isSaving: boolean

    constructor(private _route: Router,
        private authService: AuthService,
        private modalService: NgbModal,      
        private alertService: AlertService,
        public customerService: CustomerService,  
        private glAccountService: GlAccountService,
        public commonService: CommonService,
         private datePipe: DatePipe
    ) {

    }
    ngOnInit() {
        this.breadcrumbs = [
            { label: 'Accounting' },
            { label: 'GL Account List' },
        ];
    }
    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
    
    closeDeleteModal() {
        $("#downloadConfirmation").modal("hide");
    }

    getList(data) {
        this.isSpinnerVisible = true;
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete;
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.glAccountService.getglAccountList(PagingData).subscribe(
            results => {
                const gList = results['results'].map(x => {
                    return {
                        ...x,
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                        updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',                       
                    }
                });
                this.GlaccountListdata = gList                
                this.totalRecords = results['totalRecordsCount']
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);  
                this.isSpinnerVisible = false;             
            },
            err => {
                this.isSpinnerVisible = false;                
            }
        );

    }

    dateObject:any={}
    dateFilterForTable(date, field) {
        this.dateObject={}
                date=moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if(date !="" && moment(date, 'MM/DD/YYYY',true).isValid()){
            if(field=='createdDate'){
                this.dateObject={'createdDate':date}
            }else if(field=='updatedDate'){
                this.dateObject={'updatedDate':date}
            }else if(field=='startDate'){
                this.dateObject={'startDate':date}
            }            
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters ,...this.dateObject};
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getList(PagingData); 
        }else{
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,...this.dateObject};
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate){
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate){
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            if(this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.startDate){
                delete this.lazyLoadEventDataInput.filters.startDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters,...this.dateObject};
                const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
                this.getList(PagingData); 
        }
              
            }

    exportCSV(dt) {
        this.isSpinnerVisible = true;   
        const isdelete = this.currentDeletedstatus ? true : false;
        let PagingData = {"first":0,"rows":dt.totalRecords,"sortOrder":1,"filters":{"status":this.status ? this.status : 'Active',"isDeleted":isdelete},"globalFilter":""}
		let filters = Object.keys(dt.filters);
		filters.forEach(x=>{
			PagingData.filters[x] = dt.filters[x].value;
        });        
        this.glAccountService.getglAccountList(PagingData).subscribe(
             results => {
                 const gList = results['results'].map(x => {
                     return {
                         ...x,
                         createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                         updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
                     }
                 });
                 dt._value = gList;
                 dt.exportCSV();    
                 dt.value = gList;                             
                this.isSpinnerVisible = false;
             }, err => {
                 this.isSpinnerVisible = false;               
             });
     }

    changePage(event: { first: any; rows: number }) {
         const pageIndex = (event.first / event.rows);
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }  

    resetViewData() {
        this.viewRowData = undefined;
    }

    delete(rowData) {
        this.selectedRowforDelete = rowData;
    }
    dismissModel() {
        this.modal.close();
    }

    edit(rowData) {
        this._route.navigateByUrl(`generalledgermodule/generalledgerpage/app-account-listing-create/${rowData.glAccountId}`);
    }

    globalSearch(value) {
        this.isSpinnerVisible = true;
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.status ? this.status : 'Active' };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters), globalFilter: value }
        this.glAccountService.getglAccountList(PagingData).subscribe(
            results => {
                const gList = results['results'].map(x => {
                    return {
                        ...x,
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                        updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
                    }
                });
                this.GlaccountListdata = gList
                this.totalRecords = results['totalRecordsCount']
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);  
                this.isSpinnerVisible = false;             
            },
            err => {
                this.isSpinnerVisible = false;                
            }
        );
        
    }

    getListByStatus(status) {
        this.isSpinnerVisible = true;
        const pageIndex = 0;
        this.pageIndex = 0;
        this.lazyLoadEventDataInput.first = 0;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.status = status;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData);
    }

    getDeleteListByStatus(value) {
        this.isSpinnerVisible = true;
        this.currentDeletedstatus = value;
        const pageIndex = 0;
        this.pageIndex = 0;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.status = status;       
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentstatus };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.getList(PagingData);       
    }

    openDelete(content, row) {
        this.DeleteGlAccountId = row.glAccountId;     
        this.isDeleteMode = true;
        this.sourceEmployee = row
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });        
    }

    get userName(): string {	
		return this.authService.currentUser ? this.authService.currentUser.userName : "";		
	}


    deleteItemAndCloseModel() { 
        this.isSpinnerVisible = true;      
        this.glAccountService.deleteRestoreGL(this.DeleteGlAccountId,true,this.userName ).subscribe(data => {
            this.alertService.showMessage('Success','Ledger name deleted successfully.', MessageSeverity.success);
            this.modal.close();
            this.getList(this.lazyLoadEventData);        
        }, err => {
            this.isSpinnerVisible = false;           
        });
    }

    restore(restore,row) {
        this.DeleteGlAccountId = row.glAccountId;     
        this.isDeleteMode = true;
        this.sourceEmployee = row
        this.modal = this.modalService.open(restore, { size: 'sm', backdrop: 'static', keyboard: false });        
    }

    restoreRecord() {
        this.isSpinnerVisible = true;  
        this.glAccountService.deleteRestoreGL(this.DeleteGlAccountId,false,this.userName ).subscribe(data => {
            this.alertService.showMessage('Success','Ledger name restored successfully.', MessageSeverity.success);
            this.modal.close();
            this.getList(this.lazyLoadEventData);        
        }, err => {
            this.isSpinnerVisible = false;           
        });
    }

    loadGLAccountlist(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.filters = {
            ...this.lazyLoadEventDataInput.filters,
            status: this.status ? this.status : 'Active',          
        }
        if (this.filterText == true) {
            this.lazyLoadEventDataInput.filters.isDeleted = true;
        } else {
            this.lazyLoadEventDataInput.filters.isDeleted = false;
        }
        this.getList(this.lazyLoadEventDataInput);
    }   


    getAuditHistoryById(rowData) {
        this.isSpinnerVisible = true;
        this.glAccountService.getHistory(rowData.glAccountId).subscribe(res => {
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

    activeStatus(value) {
        if (value && this.currentDeletedstatus == true) {
            this.filterText = true;
        } else {
            this.filterText = false;
        }
    }
    
    viewRow(rowData) {   
        this.viewRowData  = 'View'    
        this.isSpinnerVisible = true;
        this.glAccountService.getById(rowData.glAccountId).subscribe(res => {
        this.viewRowData = res;     
        this.viewIsActive  = this.viewRowData[0].isActive; 
        this.isSpinnerVisible = false;           
        }, err => {
            this.isSpinnerVisible = false;            
        });
       
    } 
    
    changeStatus(row, e) {        
        this.isSpinnerVisible = true;
        this.glAccountService.updatestatusactive(row.glAccountId,e.checked ,this.userName ).subscribe(data => {
            this.alertService.showMessage('Success','Ledger status changed successfully.', MessageSeverity.success);
            this.getList(this.lazyLoadEventData);        
        }, err => {
            this.isSpinnerVisible = false;           
        });
    }

    columnsChanges() {}
}
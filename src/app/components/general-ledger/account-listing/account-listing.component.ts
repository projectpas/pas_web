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
import { GLAccountClassEndpoint } from '../../../services/glaccountclass-endpoint.service';
import { GlAccountService } from '../../../services/glAccount/glAccount.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs'
import * as $ from 'jquery';
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
    currentstatus: string = 'Active';
    private onDestroy$: Subject<void> = new Subject<void>();
    headers = [
        { field: 'ledgerName', header: 'Ledger Name' },
        { field: 'oldAccountCode', header: 'Old Account Code' },
        { field: 'accountCode', header: 'Account Code' },
        { field: 'accountName', header: 'Account Name' },
        { field: 'accountTypeId', header: 'Account Type' },
        { field: 'accountDescription', header: 'Account Description' },
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
    currentDeletedstatus: boolean = false;
    restoreRecordData: any;
    selectedOnly: boolean = false;
    targetData: any;
    constructor(private _route: Router,
        private authService: AuthService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        private alertService: AlertService,
        public customerService: CustomerService,
        private dialog: MatDialog,
        private masterComapnyService: MasterComapnyService,
        private GLAccountClassEndpoint: GLAccountClassEndpoint,
        private accountListingService: AccountListingService,
        private GlAccountEndpointService: GlAccountService,
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


    getListt(data) {

        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.accountListingService.getAll(PagingData).subscribe(
            results => {

                this.GlaccountListdata = results['results'];
                this.totalRecords = results['totalRecordsCount']
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
              
            },
            err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            }
        );

    }
    changePage(event: { first: any; rows: number }) {
         const pageIndex = (event.first / event.rows);
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        if (this.filteredText != "" && this.filteredText != null && this.filteredText != undefined) {
            this.globalSearch(this.filteredText);
        }
        else {
            this.table.reset();
        }
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
    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.isDeleteMode = true;
        this.sourceEmployee.isdelete = true;
        this.sourceEmployee.glAccountId = this.DeleteGlAccountId;
        this.sourceEmployee.updatedBy = this.userName;
        this.accountListingService.deleteGlAccountById(this.DeleteGlAccountId).subscribe(data => {
            this.alertService.showMessage('Success','Ledger name removed successfully.', MessageSeverity.success);
            this.modal.close();
            this.loadCustomerPages(this.lazyLoadEventData);
        }, err => {
            this.isSpinnerVisible = false;
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
         }
    isDeleteMode: boolean = false;
    private isEditMode: boolean = false;
    public DeleteGlAccountId: any;
    openDelete(content, row) {
        this.DeleteGlAccountId = row.glAccountId;
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceEmployee = row
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        
    }
    openEdit(row) {
        const { glAccountId } = row;
        this._route.navigateByUrl(`generalledgermodule/generalledgerpage/app-account-listing-create/${row.glAccountId}`);
    }

    deleteConformation(value) {
        if (value === 'Yes') {
            this.accountListingService.deleteGlAccountById(this.selectedRowforDelete.glAccountId).subscribe(response => {

                this.alertService.showMessage(
                    'Success',
                    `GL Account Deleted Successfully  `,
                    MessageSeverity.success
                );
            }, err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
            this.currentDeletedstatus = true
            this.getList(this.selectedRowforDelete)
        } else {
            this.selectedRowforDelete = undefined;
        }
    }


    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        if (event.globalFilter == null) {
            event.globalFilter = ""
        }
     }

    filterData(data) {
      //  console.log(data);
    }

    viewRow(rowData) {
        this.viewRowData='view';
        this.isSpinnerVisible = true;
        this.accountListingService.getGlAccountById(rowData.glAccountId).subscribe(res => {
	    this.viewRowData = res[0];
        this.isSpinnerVisible = false;
           
        }, err => {
            this.isSpinnerVisible = false;
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
       
    }

    edit(rowData) {

        this._route.navigateByUrl(`generalledgermodule/generalledgerpage/app-account-listing-create/${rowData.glAccountId}`);
    }

    exportCSV(dt) {
       this.isSpinnerVisible = true;
        this.exportData = [];
        const isdelete = this.currentDeletedstatus ? true : false;
        let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "status": this.currentstatus, "isDeleted": isdelete }, "globalFilter": "" }
        this.GLAccountClassEndpoint.downloadAllGlList(PagingData).subscribe(

            results => {
                const gList = results['results'].map(x => {
                    return {
                        ...x,
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                        updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
                    }
                });
               this.loadingIndicator = false;
                dt._value = gList;
                dt.exportCSV();
                dt.value = results;
               this.isSpinnerVisible = false;
            }, err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
    }
    errorMessageHandler(log) {
        var msg = '';
        if (typeof log.error == 'string') {
            this.alertService.showMessage(
                'Error',
                log.error,
                MessageSeverity.error
            );

        } else {
            this.alertService.showMessage(
                log.error.message,
                msg,
                MessageSeverity.error
            );

        }
    }


    globalSearch(value) {
        this.isSpinnerVisible = true;
        this.pageIndex = 0;
        let searchVal = value;
        const Data = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(value.filters), globalFilter: searchVal }
        const datas = {
            first: 0,
            rows: 10,
            sortField: undefined,
            sortOrder: 1,
            filters: "",
            globalFilter: value,
            multiSortMeta: undefined,
        }
        Data.filters.status= this.status ? this.status : 'Active';
        if (this.filterText == true) {
            Data.filters.isDeleted = true;
        } else {
            Data.filters.isDeleted = false;
        }
        this.accountListingService.getGlobalEntityRecords(Data).subscribe(res => {
            this.isSpinnerVisible = false;
              const data = res;

              this.GlaccountListdata = data['results'];
              if (this.GlaccountListdata.length > 0) {

                  this.totalRecords = data['totalRecordsCount'];
                  this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
              }

          }, err => {
              this.isSpinnerVisible = false;
              const errorLog = err;
              this.errorMessageHandler(errorLog);
          });
    }


    getAuditHistoryById(rowData) {
        this.isSpinnerVisible = true;
        this.accountListingService.getHistory(rowData.glAccountId).subscribe(res => {
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



    getDeleteListByStatus1(value) {
        if (value) {
            this.currentDeletedstatus = true;
        } else {
            this.currentDeletedstatus = false;
        }
        this.getListByStatus(this.status ? this.status : this.currentstatus)
    }
    status: any = "Active";

    getListByStatus(status) {
        this.isSpinnerVisible = true;
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.status = status;

        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        setTimeout(() => {
            this.isSpinnerVisible = false;
               }, 1000);
               this.getList(PagingData);
    }
    getDeleteListByStatus(value) {
        this.isSpinnerVisible = true;
        this.currentDeletedstatus = true;
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.status = status;
        if (value == true) {
            this.currentstatus = "ALL";
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: "ALL" };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            setTimeout(() => {
                this.isSpinnerVisible = false;
                   }, 1000);
                   this.getList(PagingData);
            
        } else {
            this.currentDeletedstatus = false;
            this.currentstatus = "ALL"
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: "ALL" };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            setTimeout(() => {
                this.isSpinnerVisible = false;
                   }, 1000);
                   this.getList(PagingData);
        }


    }


    restore(restore,record) {
        this.commonService.updatedeletedrecords1('glAccount', 'glAccountId', record.glAccountId).subscribe(res => {

            this.restoreRecordData = record;
            this.modal = this.modalService.open(restore, { size: 'sm', backdrop: 'static', keyboard: false });
        }, err => {
            this.isSpinnerVisible = false;
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }
    restoreRecord() {
        this.getDeleteListByStatus(true);
        this.modal.close();
        this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
    }
    activeStatus(value) {
        if (value && this.currentDeletedstatus == true) {
            this.filterText = true;
        } else {
            this.filterText = false;
        }
    }
    loadCustomerPages(event) {
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
    
    getList(data) {
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete
        const Data = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        
        this.GlAccountEndpointService.search1(Data).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
          
            this.GlaccountListdata = res[0]['results'];
            
            this.GlaccountListdata = this.GlaccountListdata;

            if (this.GlaccountListdata.length > 0) {
                this.totalRecords = res[0]['totalRecordsCount'];
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            } else {
                this.GlaccountListdata = [];
                this.totalRecords = 0;
                this.totalPages = 0;
            }

        }, err => {
            this.isSpinnerVisible = false;
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }



    sourceEmployee: any;
    Active: any;
    changeStatus(rowData, e) {
        if (e.checked == false) {
            this.sourceEmployee = rowData;
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.IsActive = false;
            var employpeeleaveTypeId = [];
            employpeeleaveTypeId.push(this.sourceEmployee.employeeLeaveTypeId);
            this.sourceEmployee.employeeLeaveTypeId = employpeeleaveTypeId;

            this.Active = "In Active";
            this.sourceEmployee.isActive = false;
            this.accountListingService.updatestatusactive(rowData).subscribe(res => {
                this.saveCompleted(this.sourceEmployee),

                    this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            }, err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
         
        }
        else {
            var employpeeleaveTypeId = [];
            this.sourceEmployee = rowData;
            employpeeleaveTypeId.push(this.sourceEmployee.employeeLeaveTypeId);
            this.sourceEmployee.employeeLeaveTypeId = employpeeleaveTypeId;
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.IsActive = true;
            this.Active = "Active";
            this.sourceEmployee.isActive == true;
            this.accountListingService.updatestatusactive(rowData).subscribe(res => {
                this.saveCompleted(this.sourceEmployee),

                    this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            }, err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }

    }

    isSaving: boolean
    private saveCompleted(user?: any) {
        this.isSaving = false;

        if (this.isDeleteMode == true) {
            this.isDeleteMode = false;
        }
        else {

        }

        this.loadCustomerPages(this.lazyLoadEventData);
    }
}
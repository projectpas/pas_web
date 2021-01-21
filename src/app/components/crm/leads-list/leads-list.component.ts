
import { Component, ViewChild, OnInit } from '@angular/core';
import {  FormBuilder} from '@angular/forms';
import { fadeInOut } from '../../../services/animations';
declare var $ : any;
import {  MatTableDataSource, MatDialog } from '@angular/material';
import { AuthService } from '../../../services/auth.service';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { CrmService } from '../../../services/crm.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import {  Table } from 'primeng/table';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { CommonService } from '../../../services/common.service';
import { CustomerViewComponent } from '../../../shared/components/customer/customer-view/customer-view.component';
import { ConfigurationService } from '../../../services/configuration.service';
@Component({
    selector: 'app-leads-list',
    templateUrl: './leads-list.component.html',
    styleUrls: ['./leads-list.component.scss'],
    animations: [fadeInOut]
})
export class LeadsListComponent implements OnInit {
    isSpinnerVisible: Boolean = true;
    totalRecords: number = 0;
    totalPages: number = 0;
    isDeleteMode: boolean = false;
    home: any;
     headers = [
        { field: 'accountType', header: 'Account Type' },
        { field: 'accountName', header: 'Accont Name' },
        { field: 'accountCode', header: 'Account Code' },
        { field: 'customerType', header: 'Customer Type' },
        { field: 'classification', header: 'Classification' },
        { field: 'accountEmail', header: 'Account Email' },
        { field: 'accountCity', header: 'Account City' },
        { field: 'accountState', header: 'Account State/Prov' },
        { field: 'accountCountry', header: 'Account Country' },
        { field: 'accountContact', header: 'Account Contact' },
        { field: 'primarySalesPerson', header: 'Primary Sales Person' },
       
    ]
    selectedColumns = this.headers;
    data: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    @ViewChild('dt',{static:false})
    private table: Table;
    lazyLoadEventData: any;
    viewData: any[];
    modal: NgbModalRef;
   
    leadauditHisory: any[];
    selectedRowforDelete: any;
    
    dataSource: MatTableDataSource<any>;
    breadcrumbs: MenuItem[];
    status: string = 'Active';
    currentstatus: string = 'Active';
    currentDeletedstatus:boolean=false;
    lazyLoadEventDataInput: any;
    selectedRow: any;
    allContacts: any;
    selectedContactColumns: any;
    restorerecord: any;
    customerauditHisory: any;
    constructor(private _route: Router,
        private authService: AuthService,
        private modalService: NgbModal,
        private alertService: AlertService,
        public crmService: CrmService,
        private commonService: CommonService,
        private configurations: ConfigurationService) {
        this.dataSource = new MatTableDataSource();
    }
    ngOnInit() {
       this.breadcrumbs = [
            { label: 'CRM' },
            { label: 'Leads List' },
        ];
    }
   
    loadData(event) {
       this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        event.globalFilter='';
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.filters = {
            ...this.lazyLoadEventDataInput.filters,
            status: this.status ? this.status : 'Active'
        }
        this.getList(event)
    }
    getList(data) {
 const isdelete=this.currentDeletedstatus ? true:false;
        data.filters.isDeleted=isdelete
        this.isSpinnerVisible = true;
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.crmService.getAllLeadList(PagingData).subscribe(res => {
            this.isSpinnerVisible = false;
            this.data = res.results;
           if (res.results.length > 0) {
                this.totalRecords = res.totalRecordsCount;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }

        })
    }
  
    filterData(data) {
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
   
    edit(rowData) {
        const { customerId } = rowData;
        this._route.navigateByUrl(`customersmodule/customerpages/app-lead-edit/${customerId}`);
    }
  
   
    dismissModel() {
        this.isDeleteMode = false;
        this.modal.close();
    }
   
   
    private saveCompleted(user?: any) {

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
            this.saveCompleted
        }
        this.getList(this.lazyLoadEventData);
    }
   
    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();

    }
   
    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();


        this.leadauditHisory = auditHistory;

        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { console.log('Backdrop click') })
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.leadauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    downloadFileUpload(rowData) {

        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }

  




}




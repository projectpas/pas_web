
import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { fadeInOut } from '../../../services/animations';
import * as $ from 'jquery';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { AuthService } from '../../../services/auth.service';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { CrmService } from '../../../services/crm.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { CommonService } from '../../../services/common.service';
import { CustomerViewComponent } from '../../../shared/components/customer/customer-view/customer-view.component';
import { ConfigurationService } from '../../../services/configuration.service';
@Component({
    selector: 'app-deals-list',
    templateUrl: './deals-list.component.html',
    styleUrls: ['./deals-list.component.scss'],
    animations: [fadeInOut]
})
export class DealsListComponent implements OnInit {
    isSpinnerVisible: Boolean = true;
    totalRecords: number = 0;
    totalPages: number = 0;
    isDeleteMode: boolean = false;
    home: any;
    headers = [
        { field: 'dealName', header: 'Deal Name' },
        { field: 'oppenDate', header: 'Open Date' },
        { field: 'closingDate', header: 'Closing Date' },
        { field: 'accountName', header: 'Account Name' },
        { field: 'accountContact', header: 'Account Contact' },
        { field: 'probability', header: 'Probability' },
        { field: 'expectedRevenue', header: 'Expected Revenue' },
        { field: 'dealStage', header: 'Deal Stage' },
        { field: 'outcome', header: 'Outcome' },
        { field: 'source', header: 'Source' },
        { field: 'followUp', header: 'Follow Up' },
        { field: 'salesPerson', header: 'Sales Person' },

    ]
    selectedColumns = this.headers;
    data: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    tax: boolean = false;
    @ViewChild('dt', { static: false })
    private table: Table;
    lazyLoadEventData: any;
    viewData: any[];
    modal: NgbModalRef;
    selectedRow: any;

    customerauditHisory: any[];
    selectedRowforDelete: any;
    currentStage: string = 'closed';
    dataSource: MatTableDataSource<any>;
    breadcrumbs: MenuItem[];
    status: string = 'Active';
    currentstatus: string = 'Active';
    currentDeletedstatus: boolean = false;
    lazyLoadEventDataInput: any;
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
            { label: 'Deals List' },
        ];
    }

    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        event.globalFilter = '';
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.filters = {
            ...this.lazyLoadEventDataInput.filters,
            stage: this.currentStage
        }
        this.getList(event)
    }
    getList(data) {
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete
        this.isSpinnerVisible = true;
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.crmService.getAllDealList(PagingData).subscribe(res => {
            this.isSpinnerVisible = false;
            this.data = res.results;
            if (res.results.length > 0) {
                this.totalRecords = res.totalRecordsCount;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }

        })
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }


    filterData(data) {
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    edit(rowData) {
        const { customerId } = rowData;
        this._route.navigateByUrl(`customersmodule/customerpages/app-deal-edit/${customerId}`);
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
    private saveFailedHelper(error: any) {

        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }





    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();

    }

    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();


        this.customerauditHisory = auditHistory;

        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { console.log('Backdrop click') })
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.customerauditHisory;
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
    allContacts: any;
    selectedContactColumns: any;
    restorerecord: any;
    columnsChanges() {}
    globalSearch(targetvalue) {}
    changeStatus(rowData) {}
    viewSelectedRow(rowData) {}
    getAuditHistoryById(rowData) {}
}




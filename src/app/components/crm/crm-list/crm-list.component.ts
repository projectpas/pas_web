
import { Component, ViewChild, OnInit } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import * as $ from 'jquery';
import {  MatTableDataSource, MatDialog } from '@angular/material';
import { AuthService } from '../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { CrmService } from '../../../services/crm.service';
import {  Table } from 'primeng/table';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import {  Inject, Input, Output, EventEmitter, ElementRef } from '@angular/core';


 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { listSearchFilterObjectCreation } from '../../../generic/autocomplete';
import { CommonService } from '../../../services/common.service';
import { ConfigurationService } from '../../../services/configuration.service';
@Component({
    selector: 'app-crm-list',
    templateUrl: './crm-list.component.html',
    styleUrls: ['./crm-list.component.scss'],
    animations: [fadeInOut]
})
export class CrmListComponent implements OnInit {

    @Input() isViewMode: boolean = false;
    isSpinnerVisible: Boolean = true;
    totalRecords: number = 0;
    totalPages: number = 0;
    isDeleteMode: boolean = false;
    home: any;
      headers = [
        { field: 'accountName', header: 'Account Name' },
        { field: 'accountType', header: 'Accont Type' },
        { field: 'parent', header: 'Parent' },
        { field: 'city', header: 'City' },
        { field: 'country', header: 'Country' },
        { field: 'contact', header: 'Contact' },
        { field: 'phone', header: 'Contact Phone' },
        { field: 'salesPerson', header: 'Sales Person' },
        { field: 'assignedDate', header: 'Assigned Date' },
        { field: 'csr', header: 'CSR' },
        { field: 'ytdRevenueTY', header: 'YTD Revenue(TY)' },
        { field: 'ytdRevenueLY', header: 'YTD Revenue(LY)' },
        { field: 'annualQuota', header: 'Quota' }
    ]
    selectedColumns = this.headers;

    dealHeaders = [
        { field: 'dealName', header: 'Deal Name' },
        { field: 'openDate', header: 'Open Date' },
        { field: 'closingDate', header: 'Closing Date' },
        { field: 'accountName', header: 'Account Name' },
		{ field: 'accountContact', header: 'Account Contact' },
		{ field: 'probability', header: 'Probability' },
        { field: 'expectedRevenue', header: 'Expected Revenue' },
        { field: 'dealStage', header: 'Deal Stage' },
		{ field: 'outCome', header: 'Outcome' },
	
		{ field: 'source', header: 'Source' },
        { field: 'followup', header: 'Follow Up' },
        { field: 'salesPerson', header: 'Salesperson' },
       
	]
	selectedColumnsDeals=this.dealHeaders;
    data: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    isNTAEDisabledSteps = true;
    @ViewChild('dt',{static:false})
    private table: Table;
    lazyLoadEventData: any;
    viewData: any[];
    modal: NgbModalRef;  
    selectedRow: any;
    selectedColumn:any;
    crmauditHistory: any[];
    selectedRowforDelete: any;
    currentNTAETab: string = 'Activities';
	activeNTAEMenuItem: number = 1;
    dataSource: MatTableDataSource<any>;
    breadcrumbs: MenuItem[];
    status: string = 'Active';
    currentstatus: string = 'Active';
    currentcomponentstatus:string='Customer';
    currentDeletedstatus:boolean=false;
    lazyLoadEventDataInput: any;
    constructor(private _route: Router,
        private authService: AuthService,
        private modalService: NgbModal,
        private alertService: AlertService,
        public crmService:CrmService,
        private commonService: CommonService,
        private configurations: ConfigurationService) {
        this.dataSource = new MatTableDataSource();
    }
    ngOnInit() {
       this.breadcrumbs = [
            { label: 'CRM' },
            { label: 'CRM List' },
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
        this.crmService.getAllCrmList(PagingData).subscribe(res => {
            this.isSpinnerVisible = false;
            this.data = res.results;
           if (res.results.length > 0) {
                this.totalRecords = res.totalRecordsCount;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }

        })
    }
    changeOfNTAETab(value) {
        if (value === 'Activites') {
            this.currentNTAETab = 'Activities';
            this.activeNTAEMenuItem = 1;
        } else if (value === 'Notes') {
            this.currentNTAETab = 'Notes';
            this.activeNTAEMenuItem = 2;
        } else if (value === 'Follow Ups') {
            this.currentNTAETab = 'Follow Ups';
            this.activeNTAEMenuItem = 3;
        } else if (value == "Communication") {
            this.currentNTAETab = 'Communication';
            this.activeNTAEMenuItem = 4;
        }

	}
  
   
    filterData(data) {
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
  
    edit(rowData) {
        const { csrId } = rowData;
        this._route.navigateByUrl(`customersmodule/customerpages/app-crm-edit/`);
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


        this.crmauditHistory = auditHistory;

        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { console.log('Backdrop click') })
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.crmauditHistory;
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




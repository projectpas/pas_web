import { AuthService } from './../../../../services/auth.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CommonService } from '../../../../services/common.service';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { DBkeys } from '../../../../services/db-Keys';
import { listSearchFilterObjectCreation, getObjectById } from '../../../../generic/autocomplete';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';


@Component({
    selector: 'app-work-order-ro-list',
    templateUrl: './work-order-ro-list.component.html',

})

export class WorkOrderROListComponent implements OnInit {
    @Input() mpnId;
    @Input() isView : boolean = false;
    workOrderRoList: any = [];
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 0;
    globalSettings: any = {};
    global_lang: any;
    isSpinnerVisible: boolean = false;
    lazyLoadEventData: any;
    currentStatus = 'open';
    viewType: any = 'mpn';
    isGlobalFilter: boolean = false;
    filterText: any = '';
    filteredText: any = '';
    private onDestroy$: Subject<void> = new Subject<void>();
    @Input() subWOPartNoId;
    @Input() isSubWorkOrder;
    roListColumns = [
        { field: 'partNumber', header: 'MCPN' },
        { field: 'partDescription', header: 'MCPN Description' },
        { field: 'serialNumber', header: 'MC Serial #' },
        { field: 'repairOrderNumber', header: 'RO Num' },
        { field: 'quantityOrdered', header: '# of Items' },
        { field: 'controlNumber', header: 'Control #' },
        { field: 'controllerId', header: 'Control Id' },
        { field: 'unitCost', header: 'Unit Cost' },
        { field: 'extendedCost', header: 'Extended Cost' },
        { field: 'currency', header: 'Currency' },
        { field: 'vendorName', header: 'Vendor Name' },
        { field: 'status', header: 'Status' },
        { field: 'openDate', header: 'Open Date' },
        { field: 'needByDate', header: 'Need By Date' },
    ];
    selectedColumns = this.roListColumns;

    constructor(private workOrderService: WorkOrderService, 
        private localStorage: LocalStoreManager,
        private datePipe: DatePipe,
        private authService: AuthService) { }

    ngOnInit() {
        // this.getExistingRoList();
         this.getGlobalSettings();
    }

    getGlobalSettings() {
        this.globalSettings = this.localStorage.getDataObject<any>(DBkeys.GLOBAL_SETTINGS) || {};
        this.global_lang = this.globalSettings.cultureName;
    }

    getExistingRoList() {
        this.isSpinnerVisible = true;
        this.workOrderService.getExistingWOROList().subscribe(res => {
            this.workOrderRoList = res.map(x => {
                this.isSpinnerVisible = false;
                return {
                    ...x,
                    unitCost: this.formatCost(x.unitCost),
                    extendedCost: this.formatCost(x.extendedCost)
                }
            });
            console.log(res);

        },
        err => {
            this.isSpinnerVisible = false;
        });
    }
    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        if (this.currentStatus) {
            this.lazyLoadEventData.filters = {
                ...this.lazyLoadEventData.filters,
                workOrderStatus: this.lazyLoadEventData.filters.workOrderStatus == undefined ? this.currentStatus : this.lazyLoadEventData.filters.workOrderStatus,
                viewType: this.viewType
            }
        }

        if (!this.isGlobalFilter) {   
            this.getAllWorkOrderRoList(event);         
        } else {
            this.globalSearch(this.filterText)
        }
    }

    getAllWorkOrderRoList(data) {
        this.isSpinnerVisible = true;
        const isdelete = false;
        data.filters.isDeleted = isdelete;
        data.filters.masterCompanyId= this.currentUserMasterCompanyId;

        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.workOrderService.WorkOrderROlist(PagingData).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            this.workOrderRoList = res['results'].map(x => {
                return {
                    ...x,
                    openDate: x.openDate ? this.datePipe.transform(x.openDate, 'MMM-dd-yyyy') : '',
                    needByDate: x.needByDate ? this.datePipe.transform(x.needByDate, 'MMM-dd-yyyy hh:mm a') : '',
                    unitCost: this.formatCost(x.unitCost),
                    extendedCost: this.formatCost(x.extendedCost)
                }
            });
            

            if (res.results.length > 0) {
                this.totalRecords = res.totalRecordsCount;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            } else {
                this.totalRecords = 0;
                this.totalPages = 0;
            }
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        })
    }
    globalSearch(value) {
        this.pageIndex = 0;
        this.filteredText = value;
        if (this.filteredText != "" && this.filteredText != null && this.filteredText != undefined) {
            this.isGlobalFilter = true;
        }
        else
        {
            this.isGlobalFilter = false;
        }        
        const pageIndex = parseInt(this.lazyLoadEventData.first) / this.lazyLoadEventData.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventData.rows;
        this.lazyLoadEventData.first = pageIndex;
        this.lazyLoadEventData.globalFilter = value;
        this.filterText = value;
        this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters, woFilter: this.currentStatus };
        this.getAllWorkOrderRoList(this.lazyLoadEventData);
    }


    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }
    edit(rowData) {
        if(this.isSubWorkOrder==true){
            const { repairOrderId } = rowData;
            window.open(`/vendorsmodule/vendorpages/workorder-ro-edit/${repairOrderId}/${0}/${0}/${0}/${this.subWOPartNoId}`);
        }else{
            const { repairOrderId } = rowData;
            window.open(`/vendorsmodule/vendorpages/workorder-ro-edit/${repairOrderId}/${this.mpnId}`);
        }
    }

    formatCost(val) {
        if (val) {
            if (isNaN(val) == true) {
                val = Number(val.replace(/[^0-9.-]+/g, ""));
            }
            val = new Intl.NumberFormat(this.global_lang, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)
            return val;
        }
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
}
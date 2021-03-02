﻿import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { DBkeys } from '../../../../services/db-Keys';
declare var $ : any;
@Component({
    selector: 'app-work-order-analysis',
    templateUrl: './work-order-analysis.component.html',
    styleUrls: ['./work-order-analysis.component.scss']
})
/** WorkOrderAnalysis component*/
export class WorkOrderAnalysisComponent implements OnInit, OnChanges {

    @Input() savedWorkOrderData;
    @Input() selectedPartNumber: any = {};
    @Input() subWorkOrderDetails;
    @Input() isSubWorkOrder:any=false;
    @Input() subWOPartNoId;
    lazyLoadEventData: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 10;
    data: any[] = [];
    globalSettings: any = {};
    global_lang: any;
    private onDestroy$: Subject<void> = new Subject<void>();
    headers = [
        { field: 'partNumber', header: 'Main PN' },
        { field: 'revisedPartNo', header: 'Revised PN' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'workOrderNum', header: 'WO Num' },
        { field: 'stage', header: 'Stage' },
        { field: 'revenue', header: 'Revenue' },
        { field: 'materialCost', header: 'Parts Cost' },
        { field: 'materialRevenuePercentage', header: 'Parts Rev %' },
        { field: 'laborCost', header: 'Labor Cost' },
        { field: 'laborRevenuePercentage', header: 'Labor Rev %' },
        { field: 'overHeadCost', header: 'Overhead Cost' },
        { field: 'overHeadCostRevenuePercentage', header: 'Overhead Cost %' },
        { field: 'otherCost', header: 'Other Cost' },
        { field: 'directCost', header: 'Direct Cost' },
        { field: 'directCostRevenuePercentage', header: 'Direct Cost Rev %' },
        { field: 'margin', header: 'Margin' },
        { field: 'marginPercentage', header: 'Margin %' },
        { field: 'customerName', header: 'Customer' },
        { field: 'status', header: 'Status' },
    ]
    selectedColumns = this.headers;
    workOrderId: any;

    constructor(private workOrderService: WorkOrderService, private localStorage: LocalStoreManager) { }

    ngOnInit() {
        this.workOrderId = this.savedWorkOrderData.workOrderId;
        if (this.data.length != 0) {
            this.totalRecords = this.data.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        }
        this.getWorkOrderAnalysisData(this.workOrderId);
        this.getGlobalSettings();
    }
    ngOnChanges() {
        if (this.data.length != 0) {
            this.totalRecords = this.data.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        }
    }
    ngOnDestroy(): void {
        this.onDestroy$.next();
    }

    getGlobalSettings() {
        this.globalSettings = this.localStorage.getDataObject<any>(DBkeys.GLOBAL_SETTINGS) || {};
        this.global_lang = this.globalSettings.cultureName;
    }

    getWorkOrderAnalysisData(workOrderId) {
        const id = this.isSubWorkOrder ? this.subWOPartNoId : this.selectedPartNumber.workOrderPartNumberId;
        this.workOrderService.workOrderAnalysisData(workOrderId, id, this.isSubWorkOrder)
            .pipe(takeUntil(this.onDestroy$)).subscribe(
                (res: any) => {
                    if (res) {
                        this.data = res.map(x => {
                            return {
                                ...x,
                                materialCost: this.formatCost(x.materialCost),
                                materialRevenuePercentage: this.formatCost(x.materialRevenuePercentage),
                                laborCost: this.formatCost(x.laborCost),
                                laborRevenuePercentage: this.formatCost(x.laborRevenuePercentage),
                                overHeadCost: this.formatCost(x.overHeadCost),
                                otherCost: this.formatCost(x.otherCost),
                                directCost: this.formatCost(x.directCost),
                                otherCostRevenuePercentage: this.formatCost(x.otherCostRevenuePercentage),
                                revenuePercentage: this.formatCost(x.revenuePercentage)
                            }
                        });
                        // if (this.data.length != 0) {
                        //   this.totalRecords = this.data.length;
                        //   this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                        // }
                    }
                }
            )
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
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
    closeModal() {
        $("#downloadConfirmation").modal("hide");
    }
}

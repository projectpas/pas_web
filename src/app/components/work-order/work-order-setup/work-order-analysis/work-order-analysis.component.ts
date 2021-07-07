import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { DBkeys } from '../../../../services/db-Keys';
import { AuthService } from '../../../../services/auth.service';
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
    isSpinnerVisible:boolean=false;
    global_lang: any;
    private onDestroy$: Subject<void> = new Subject<void>();
    headers = [
        { field: 'partNumber', header: 'Main PN',width:"120px" },
        { field: 'revisedPartNo', header: 'Revised PN',width:"100px" },
        { field: 'partDescription', header: 'PN Description',width:"250px" },
        { field: 'workOrderNum', header: 'WO Num',width:"100px" },
        { field: 'stage', header: 'Stage',width:"100px" },
        { field: 'revenue', header: 'Revenue',width:"100px" },
        { field: 'materialCost', header: 'Parts Cost' ,width:"100px"},
        { field: 'materialRevenuePercentage', header: 'Parts Rev %' ,width:"100px"},
        { field: 'laborCost', header: 'Labor Cost',width:"100px" },
        { field: 'laborRevenuePercentage', header: 'Labor Rev %',width:"100px" },
        { field: 'overHeadCost', header: 'Overhead Cost',width:"110px" },
        { field: 'overHeadCostRevenuePercentage', header: 'Overhead Cost %' ,width:"130px"},
        { field: 'otherCost', header: 'Other Cost',width:"100px" },
        { field: 'freightCost', header: 'Freight Cost',width:"100px" },
        { field: 'directCost', header: 'Direct Cost',width:"100px" },
        { field: 'directCostRevenuePercentage', header: 'Direct Cost Rev %',width:"120px" },
        { field: 'margin', header: 'Margin',width:"100px" },
        { field: 'marginPercentage', header: 'Margin %',width:"100px" },
        { field: 'customerName', header: 'Customer',width:"120px" },
        { field: 'status', header: 'Status',width:"100px" },
    ]
    selectedColumns = this.headers;
    workOrderId: any;

    constructor(private workOrderService: WorkOrderService,        private authService: AuthService, private localStorage: LocalStoreManager) { }

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
        this.isSpinnerVisible=true;
        const id = this.isSubWorkOrder ? this.subWOPartNoId : this.selectedPartNumber.workOrderPartNumberId;
        this.workOrderService.workOrderAnalysisData(workOrderId, id, this.isSubWorkOrder,this.authService.currentUser.masterCompanyId)
            .pipe(takeUntil(this.onDestroy$)).subscribe(
                (res: any) => {

                    this.isSpinnerVisible=false;
                    if (res) {
                        this.data = res.map(x => {
                            return {
                                ...x,
                                revenue: this.formatCost(x.revenue),
                                materialCost: this.formatCost(x.materialCost),
                                materialRevenuePercentage: this.formatCost(x.materialRevenuePercentage),
                                laborCost: this.formatCost(x.laborCost),
                                laborRevenuePercentage: this.formatCost(x.laborRevenuePercentage),
                                overHeadCost: this.formatCost(x.overHeadCost),
                                otherCost: this.formatCost(x.otherCost),
                                directCost: this.formatCost(x.directCost),
                                freightCost: this.formatCost(x.freightCost),
                                directCostRevenuePercentage: this.formatCost(x.directCostRevenuePercentage),
                                revenuePercentage: this.formatCost(x.revenuePercentage),
                                margin: this.formatCost(x.margin),
                                marginPercentage: this.formatCost(x.marginPercentage)
                            }
                        });
                        // if (this.data.length != 0) {
                        //   this.totalRecords = this.data.length;
                        //   this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                        // }
                    }
                }, error => {
                    this.isSpinnerVisible = false;
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
            return val.toFixed(2);
        }
    }
    closeModal() {
        $("#downloadConfirmation").modal("hide");
    }
}

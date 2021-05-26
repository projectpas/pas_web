import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { editValueAssignByCondition, getObjectById, listSearchFilterObjectCreation } from '../../../../generic/autocomplete';
declare var $: any;
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { DBkeys } from '../../../../services/db-Keys';
import { AuthService } from '../../../../services/auth.service';
@Component({
    selector: 'app-work-order-release-from-list',
    templateUrl: './work-order-release-from-list.component.html',
    styleUrls: ['./work-order-release-from-list.component.css']
})

export class WorkOrderReleaseFromListComponent implements OnInit, OnChanges {


    @Input() workOrderPartNumberId;
    @Input() workOrderId;
    lazyLoadEventData: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 10;
    releaseFromId:number=0;
    data: any[] = [];
    globalSettings: any = {};
    global_lang: any;
    is9130from:boolean=false;
    is8130from:boolean=false;
    isView:boolean=false;
    isEdit:boolean=false;
    isViewopen:boolean=false;
    assetAuditHistory: any;
    ReleaseData: any;
    private onDestroy$: Subject<void> = new Subject<void>();
    headers = [
        { field: 'trackingNo', header: 'Trackin No' },
        { field: 'organizationName', header: 'Organization Name' },
        { field: 'invoiceNo', header: 'InvoiceNo' },
        { field: 'description', header: 'Description' },
        { field: 'partNumber', header: 'PartNumber' },
        { field: 'eligibility', header: 'Eligibility',width:"80px" },
        { field: 'quantity', header: 'Quantity' ,width:"80px"},
        { field: 'batchnumber', header: 'Batchnumber' ,width:"80px"},
        { field: 'status', header: 'Status',width:"80px" }
        
    ]
    selectedColumns = this.headers;

    constructor(private workOrderService: WorkOrderService,        private authService: AuthService, private localStorage: LocalStoreManager) { }

    ngOnInit() {
        if (this.data.length != 0) {
            this.totalRecords = this.data.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        }
        this.getWorkOrderAnalysisData(this.workOrderId,this.workOrderPartNumberId);
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

    getWorkOrderAnalysisData(workOrderId,workOrderPartNumberId) {
        this.workOrderService.workOrderReleaseFromListData(workOrderId, workOrderPartNumberId)
            .pipe(takeUntil(this.onDestroy$)).subscribe(
                (res: any) => {
                    if (res) {
                        this.data = res.map(x => {
                            return {
                                ...x,
                                // materialCost: this.formatCost(x.materialCost),
                                // materialRevenuePercentage: this.formatCost(x.materialRevenuePercentage),
                                // laborCost: this.formatCost(x.laborCost),
                                // laborRevenuePercentage: this.formatCost(x.laborRevenuePercentage),
                                // overHeadCost: this.formatCost(x.overHeadCost),
                                // otherCost: this.formatCost(x.otherCost),
                                // directCost: this.formatCost(x.directCost),
                                // otherCostRevenuePercentage: this.formatCost(x.otherCostRevenuePercentage),
                                // revenuePercentage: this.formatCost(x.revenuePercentage)
                            }
                        });
                    }
                }
            )
    }
    getAuditHistoryById(rowData) 
    {
      
        this.workOrderService.GetReleaseHistory(rowData.releaseFromId).subscribe(res => {
            this.assetAuditHistory = res;
        },
            err => {
            })

    }

    Edit(rowData)
    {   this.releaseFromId= rowData.releaseFromId;
        this.isEdit= true;
        this.ReleaseData = rowData;
        if(rowData.is8130from)
        {
            this.is8130from= true;
        }else
        {
            this.is9130from= true;
        }
       
    }

    view(rowData)
    {   this.releaseFromId= rowData.releaseFromId;
        this.isViewopen= true;
        this.ReleaseData = rowData;
        if(rowData.is8130from)
        {
            this.is8130from= true;
        }else
        {
            this.is9130from= true;
        }
        
     
    }
    createNew()
    {
        this.is8130from= true;
    }
    create9130New()
    {
        this.is9130from= true;
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
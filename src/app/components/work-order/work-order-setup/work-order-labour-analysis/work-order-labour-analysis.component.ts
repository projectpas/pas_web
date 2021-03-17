import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';
declare var $ : any;
@Component({
    selector: 'app-work-order-labour-analysis',
    templateUrl: './work-order-labour-analysis.component.html',
    styleUrls: ['./work-order-labour-analysis.component.css']
})
/** WorkOrderMainComponent component*/ 
export class WorkOrderLabourAnalysisComponent implements OnInit, OnChanges {
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
    isSpinnerVisible: boolean = false;
    private onDestroy$: Subject<void> = new Subject<void>();
    headers = [
        { field: 'partNumber', header: 'Main PN' },
        { field: 'revisedPN', header: 'Revised PN' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'action', header: 'Task' },
        { field: 'expertise', header: 'Tech' },
        { field: 'hours', header: 'Hours' },
        { field: 'customer', header: 'Customer' },
        { field: 'workOrderNum', header: 'WO Num' },
        { field: 'stage', header: 'Stage' },
        { field: 'status', header: 'Status' }
    ]
    selectedColumns = this.headers;
    workOrderId: any;
    constructor(private workOrderService: WorkOrderService, private authService: AuthService, ) { }
    ngOnInit() {
        this.workOrderId = this.savedWorkOrderData.workOrderId;
        if (this.data.length != 0) {
            this.totalRecords = this.data.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        }
        this.getWorkOrderLabourAnalysisData(this.workOrderId);
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
    getWorkOrderLabourAnalysisData(workOrderId) {
        this.isSpinnerVisible = true;
 const id = this.isSubWorkOrder ? this.subWOPartNoId : this.selectedPartNumber.workOrderPartNumberId;
        this.workOrderService.workOrderLabourAnalysisData(workOrderId, id, this.isSubWorkOrder,this.authService.currentUser.masterCompanyId)
            .pipe(takeUntil(this.onDestroy$)).subscribe(
                (res: any) => {
                    this.isSpinnerVisible = false;
                    if (res) {
                        this.data = res;
                    }
                },
                err => {
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
    closeModal() {
        $("#downloadConfirmation").modal("hide");
    }
}

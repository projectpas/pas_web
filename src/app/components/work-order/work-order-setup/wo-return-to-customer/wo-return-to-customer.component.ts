import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';

@Component({
    selector: 'app-wo-return-to-customer',
    templateUrl: './wo-return-to-customer.component.html',
    styleUrls: ['./wo-return-to-customer.component.scss']
})
/** WorkOrderAdd component*/
export class WOReturnToCustomerComponent implements OnInit {
    @Input() workOrderPartNoId;
    @Input() workOrderId;
    partNumbersList: any[] = [];
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number;
    isSpinnerVisible: boolean = false;
    headers = [
        { field: 'partNumber', header: 'Part Number' },
        { field: 'partDescription', header: 'Part Description' },
        { field: 'mcSerial', header: 'MC Serial' },
        { field: 'customer', header: 'Customer' },
        { field: 'stockLineNumber', header: 'Stock Line Number' },
        { field: 'serialNumber', header: 'Serial Number' },
        { field: 'controlId', header: 'Control Id' },
        { field: 'qtyToReturn', header: 'Qty To Return' },
        { field: 'qtyReserved', header: "Qty Res'd" }
    ];
    moduleName = "Return to customer";
    isView: boolean;
    selectedColumns = this.headers;
    constructor(private workOrderService: WorkOrderService, private alertService: AlertService){

    }
    ngOnInit(){
        this.getPartNumberReturned();
    }

    getPartNumberReturned(){
        this.isSpinnerVisible = true;
        this.workOrderService.getReturnedPartsToCustomer(this.workOrderId, this.workOrderPartNoId)
        .subscribe(
            (res: any[])=>{
                this.isSpinnerVisible = false;
                this.partNumbersList = res;
                this.totalRecords = res.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            },
            (err) => {
                this.errorHandling(err);
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

    errorHandling(err){
        this.alertService.showMessage(
            this.moduleName,
            'Error while fetching data',
            MessageSeverity.error
        );
    }

    edit(rowData, rowIndex) {}

    deleteMemo(rowDate) {}
}
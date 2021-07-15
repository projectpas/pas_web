import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CommonService } from '../../../../services/common.service';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';



@Component({
    selector: 'app-work-order-ro-create',
    templateUrl: './work-order-ro-create.component.html',

})
/** WorkOrderShipping component*/
export class WorkOrderROCreateComponent implements OnInit {
    workOrderROPartsList: any = [];
    pageSize: number = 10;
    @Input() isView: boolean = false;
    isSpinnerVisible: boolean = true;

    constructor(private workOrderService: WorkOrderService) { }
    @Input() mpnId;
    @Input() subWOPartNoId;
    @Input() isSubWorkOrder;
    roListColumns = [
        { field: 'mcpn', header: 'MCPN' },
        { field: 'mcpndescription', header: 'MCPN Description' },
        { field: 'mcserial', header: 'MC Serial #' },
        { field: 'stockline', header: 'Stk Line ' },
        { field: 'control', header: 'Cntrl' },
        { field: 'controlid', header: 'Cntrl #' },
        { field: 'controllerId', header: 'Cntrl ID' },
        { field: 'qtytorepair', header: 'Qty to Rep' },
        { field: 'qtyreserved', header: 'Qty to Reserved' },

    ]

    ngOnInit() {
        console.log(this.mpnId)
        this.getNewROCreate();
    }

    getNewROCreate() {
        this.isSpinnerVisible = true;
        this.workOrderService.createNewWORO(this.mpnId).subscribe(res => {
            this.isSpinnerVisible = false;
            this.workOrderROPartsList = [res];
        },
        err => {
            this.isSpinnerVisible = false;
        })
    }

    createNewRoWorkOrder(rowData) {
        if(this.isSubWorkOrder==true){
            window.open(`/vendorsmodule/vendorpages/workorder-ro-create/${0}/${0}/${0}/${0}/${this.subWOPartNoId}`)
        }else{
            window.open(`/vendorsmodule/vendorpages/workorder-ro-create/${0}/${this.mpnId}`)
        }
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    closeModel() {
    }
}
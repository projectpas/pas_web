import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
declare var $: any;
import * as moment from 'moment';
@Component({
    selector: 'app-sub-work-orderlist',
    templateUrl: './work-order-subwo-list.component.html',
})
export class SubWorkOrderListComponent implements OnInit {
    workOrderPublicationList: Object;
    workOrderChargesList: Object;
    workOrderExclusionsList: Object;
    workOrderLaborList: any;
    workOrderDirectionList: Object;
    @Input() workOrderId;
    @Input() mpnId;
    @Input() isView: boolean = false;
    @Input() forSubWorkOrder = false;
    @Input() workOrderMaterialsId: any;
    @Input() workOrderNumberStatus:any;
    @Output() triggerModelData = new EventEmitter();
    subWorkOrderData: any = [];
    subWorkOrderCols = [
        { field: 'subWorkOrderNo', header: 'Sub WorkOrderNo' },
        { field: 'masterPartNo', header: 'Part' },
        { field: 'masterPartDescription', header: 'Description' },
        { field: 'revisedPartNo', header: 'Revised PartNo' },
        { field: 'openDate', header: 'Open Date' },
        { field: "createdDate", header: "Created Date", width: "130px" },
        { field: "createdBy", header: "CreatedBy", width: "130px" },
        { field: "updatedDate", header: "Updated Date", width: "130px" },
        { field: "updatedBy", header: "UpdatedBy", width: "130px" }

    ]
    subWorkOrderHeader: any;
    showTableGrid: boolean = false;
    activeIndex: number;
    workOrderAssetList: any;
    workOrderMaterialList: any;
    pageSize: number = 10;
    selectedOtherSubTask: any;
    workFlowId: any;
    isWorkOrder: any;
    otherOptionShow: any;
    isSpinnerVisible: boolean = false;
    subWorkOrderDataOriginal:any=[]
    constructor(public _router: Router, private workOrderService: WorkOrderService, private authService: AuthService,) { }
    ngOnInit() {
        this.getSubWorkOrderByWorkOrderId();
    }
    getSubWorkOrderByWorkOrderId() {
        console.log(this.workOrderId);
        this.workOrderService.getSubWorkOrderListByWorkOrderId(this.workOrderId).subscribe(res => {
          this.subWorkOrderDataOriginal=res;
            this.subWorkOrderData = res;
        })
    }
    openNewSubWorkOrder() {
        const subworkorderid = 0;
        window.open(`/workordersmodule/workorderspages/app-sub-work-order?workorderid=${this.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${subworkorderid}`);
    }
    subWorkOrderId: any;
    view(rowData) {
        this.isSpinnerVisible = true;
        this.subWorkOrderId = undefined;
        this.subWorkOrderId = rowData.subWorkOrderId;
        this.isView = true;

        setTimeout(() => {
            this.isSpinnerVisible = false;
        }, 1000);
    }
    edit(rowData) {
        const { subWorkOrderId } = rowData;
        localStorage.setItem('woStatus', this.workOrderNumberStatus);
        // window.open(`/workordersmodule/workorderspages/app-sub-work-order?workorderid=${this.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${subWorkOrderId}`);
   
        this._router.navigateByUrl(
            `workordersmodule/workorderspages/app-sub-work-order?workorderid=${this.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${subWorkOrderId}`
          );
    }
    delete(rowData) {

    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    AddSubWo(rowData) {
this.triggerModelData.emit(true)

        const subworkorderid = 0;
        // window.open(`/workordersmodule/workorderspages/app-sub-work-order?workorderid=${this.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${rowData.subWorkOrderId}&workOrderMaterialsId=${this.workOrderMaterialsId}&exist=${1}`);
   
        this._router.navigateByUrl(
            `workordersmodule/workorderspages/app-sub-work-order?workorderid=${this.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${rowData.subWorkOrderId}&workOrderMaterialsId=${this.workOrderMaterialsId}&exist=${1}`
          );
   
   
    }
    showOtherOptions() { }
    otherOptionSelected(option) { }
    dateFilterForTable(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.subWorkOrderData = this.subWorkOrderDataOriginal;
            const data = [...this.subWorkOrderData.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                } else if (moment(x.openDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'openDate') {
                    return x;
                }
            })]
            this.subWorkOrderData = data;
        } else {
            this.subWorkOrderData = this.subWorkOrderDataOriginal;
        }
    }
    closeView(){
        this.isView=false;
    }
}
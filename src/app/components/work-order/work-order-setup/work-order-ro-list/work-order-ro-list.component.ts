import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { CommonService } from '../../../../services/common.service';
import { MessageSeverity, AlertService } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { DBkeys } from '../../../../services/db-Keys';


@Component({
    selector: 'app-work-order-ro-list',
    templateUrl: './work-order-ro-list.component.html',

})

export class WorkOrderROListComponent implements OnInit {
    @Input() mpnId;
    @Input() isView : boolean = false;
    workOrderRoList: any = [];
    pageSize: number = 10;
    globalSettings: any = {};
    global_lang: any;
    isSpinnerVisible: boolean = false;
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

    constructor(private workOrderService: WorkOrderService, private localStorage: LocalStoreManager) { }

    ngOnInit() {
        this.getExistingRoList();
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
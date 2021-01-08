import { Component, OnInit, Input } from '@angular/core';
import { ReceivingService } from '../../../../services/receiving/receiving.service';
import { PurchaseOrder, PurchaseOrderPart } from '../receivng-po/PurchaseOrder.model';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';

@Component({
  selector: 'app-po-view-list',
  templateUrl: './po-view-list.component.html',
  styleUrls: ['./po-view-list.component.scss']
})

export class POViewListComponent implements OnInit {
    @Input() purchaseOrderData: PurchaseOrder;
    toggleIcon: boolean = false;
    toggleAddDetails: boolean = false;   
    currentSLIndex: number = 0;
    currentTLIndex: number = 0;
    currentSERIndex: number = 0;
    pageTitle: string = 'View Purchase Order';
    constructor(private receivingService: ReceivingService,
        private alertService: AlertService) {
    }
    
    ngOnInit() {
        console.log(this.purchaseOrderData);
    }

    moveStockLinePage(type: string, index: number, part: PurchaseOrderPart): void {
        var count = type == 'stockline' ? part.stockLine.length : part.timeLife.length;
        if (index >= 0 && index < count) {
            // if (part.itemMaster.isSerialized) {
            //     part.currentSLIndex = index;
            // }
            
            part.currentSLIndex = index;
            
            part.currentSERIndex = index;
            part.currentTLIndex = index;
        }
    }

    private gotoStockLinePage(event: any, part: PurchaseOrderPart): void {
        let value = event.target.value;
        let index: number = 0;
        if (value == '') {
            return;
        }
        index = Number.parseInt(value) - 1;

        if (index < part.stockLine.length && index >= 0) {
            if (part.itemMaster.isSerialized) {
                part.currentSLIndex = index;
                part.currentSERIndex = index;
            }
            part.currentTLIndex = index;
        }
        else {
            this.alertService.showMessage(this.pageTitle, "Invalid stock line page", MessageSeverity.error);
            event.target.value = "1";
            if (!part.isSameDetailsForAllParts) {
                part.currentSLIndex = 0;
                part.currentSERIndex = 0;
            }
            part.currentTLIndex = 0;
            part.currentSERIndex = 0;
            return;
        }
    }

    private onDataLoadFailed(error: any) {
    }

    toggleExpandIcon(part: PurchaseOrderPart) {
        part.showStockLineGrid = !part.showStockLineGrid; 
        // part.showStockLineGrid = part.showStockLineGrid != undefined ? true : !part.showStockLineGrid; 
        //this.toggleIcon = !this.toggleIcon;
    }

    addStockLine() {
        this.toggleAddDetails = !this.toggleAddDetails;
    }
}
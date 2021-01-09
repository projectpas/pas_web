import { Component, OnInit, Input } from '@angular/core';
import { ReceivingService } from '../../../../services/receiving/receiving.service';
import { PurchaseOrder, PurchaseOrderPart } from '../receivng-po/PurchaseOrder.model';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';

@Component({
  selector: 'app-po-view-draftlist',
  templateUrl: './po-view-draftlist.component.html',
  styleUrls: ['./po-view-draftlist.component.scss']
})

export class POViewStockDraftListComponent implements OnInit {
    @Input() purchaseOrderData: PurchaseOrder;
    toggleIcon: boolean = false;
    toggleAddDetails: boolean = false;   
    currentSLIndexDraft: number = 0;
    currentTLIndexDraft: number = 0;
    currentSERIndexDraft: number = 0;
    pageTitle: string = 'View Purchase Order';
    purchaseOrderPart: any = []; //PurchaseOrderPart[];
    currentStockLineShowIndex: number = 0;
    
    constructor(private receivingService: ReceivingService,
        private alertService: AlertService) {
    }
    
    ngOnInit() {
        console.log(this.purchaseOrderData);
       this.purchaseOrderData.purchaseOderPart.map(x => {
        const data = {
                ...x,
                stockLine: this.getStockline(x),
                timeLife: x.timeLifeDraft
            }
            this.purchaseOrderPart.push(data);
        });
        // this.purchaseOrderPart = data;
        // console.log(this.purchaseOrderPart);
        // this.purchaseOrderPart[0].stockLine.map((x, index) => {
        //     return {
        //         ...x,
        //         currentSLIndexDraft: index
        //     }
        // })
        // console.log(this.purchaseOrderPart);
    }

    getStockline(data) {
        data.stockLineDraft = data.stockLineDraft.map((x, index) => {
            return {
                ...x,
                purchaseOrderUnitCost: x.purchaseOrderUnitCost ? formatNumberAsGlobalSettingsModule(x.purchaseOrderUnitCost, 2) : '0.00',
                purchaseOrderExtendedCost: x.purchaseOrderExtendedCost ? formatNumberAsGlobalSettingsModule(x.purchaseOrderExtendedCost, 2) : '0.00',
                currentSLIndexDraft: index
            }
        })
        return data.stockLineDraft;
    }

    moveStockLinePage(type: string, index: number, part: PurchaseOrderPart, stockline): void {
        var count = type == 'stockline' ? part.stockLine.length : part.timeLife.length;
        if (index >= 0 && index < count) {
            // if (part.itemMaster.isSerialized) {
            //     stockline.currentSLIndexDraft = index;
            // }
            // stockline.currentSLIndexDraft = index ;
            this.currentStockLineShowIndex = index;
            console.log(index);            
            console.log(stockline);
            stockline.currentSERIndexDraft = index;
            stockline.currentTLIndexDraft = index ;
            // this.purchaseOrderPart = this.purchaseOrderPart.map(x => {
            //     return {...x}
            // })
        }

    }

    public gotoStockLinePage(event: any, part: PurchaseOrderPart, stockline): void {
        let value = event.target.value;
        let index: number = 0;
        if (value == '') {
            return;
        }
        index = Number.parseInt(value) - 1;

        if (index < part.stockLine.length && index >= 0) {
            // if (part.itemMaster.isSerialized) {
                // stockline.currentSLIndexDraft = index;
                this.currentStockLineShowIndex = index;
                stockline.currentSERIndexDraft = index;
            // }
            stockline.currentTLIndexDraft = index;
        }
        else {
            this.alertService.showMessage(this.pageTitle, "Invalid stock line page", MessageSeverity.error);
            event.target.value = "1";
            if (!part.isSameDetailsForAllParts) {
                this.currentStockLineShowIndex = index;
                // stockline.currentSLIndexDraft = 0;
                stockline.currentSERIndexDraft = 0;
            }
            stockline.currentTLIndexDraft = 0;
            stockline.currentSERIndexDraft = 0;
            return;
        }
    }

    private onDataLoadFailed(error: any) {
    }

    toggleExpandIcon(part: PurchaseOrderPart) {
        part.showStockLineGridDraft = !part.showStockLineGridDraft; 
        // part.showStockLineGridDraft = part.showStockLineGridDraft != undefined ? true : !part.showStockLineGridDraft; 
        //this.toggleIcon = !this.toggleIcon;
    }

    addStockLine() {
        this.toggleAddDetails = !this.toggleAddDetails;
    }
}